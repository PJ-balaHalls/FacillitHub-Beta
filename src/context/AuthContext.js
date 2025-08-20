// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
    // Agora teremos dois estados: um para a autenticação e outro para o perfil detalhado
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSessionAndProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                // Se há uma sessão, busca o perfil correspondente
                const { data: userProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(userProfile ?? null);
            }
            setLoading(false);
        };

        getSessionAndProfile();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    // Também busca o perfil quando o estado de auth muda
                    const { data: userProfile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    setProfile(userProfile ?? null);
                } else {
                    setProfile(null); // Limpa o perfil no logout
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        profile, // Disponibiliza o perfil para toda a aplicação
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};