// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndProfile = async (sessionUser) => {
            if (sessionUser) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', sessionUser.id)
                    .single();

                if (profileError) {
                    console.error('Erro ao buscar perfil:', profileError.message);
                    setProfile(null);
                    return;
                }

                if (profileData) {
                    const { data: memberData, error: memberError } = await supabase
                        .from('organization_members')
                        .select('role')
                        .eq('user_id', sessionUser.id)
                        .single();

                    if (memberError) {
                        setProfile(profileData);
                    } else {
                        const completeProfile = { ...profileData, role: memberData?.role };
                        setProfile(completeProfile);
                    }
                }
            } else {
                setProfile(null);
            }
        };
        
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            await fetchUserAndProfile(session?.user);
            setLoading(false);
        };
        
        initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            await fetchUserAndProfile(session?.user);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signIn = async ({ email, password }) => {
        // --- INÍCIO DA CORREÇÃO ---
        const result = await supabase.auth.signInWithPassword({ email, password });

        // Adicionamos esta verificação de segurança. Se o resultado for nulo,
        // o problema é de configuração, e lançamos um erro claro.
        if (!result) {
            throw new Error("A resposta da autenticação foi inesperada. Verifique a conexão e a configuração do Supabase no arquivo .env.");
        }

        const { error } = result;
        if (error) {
            throw error;
        }
        // --- FIM DA CORREÇÃO ---
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const signUp = async (email, password, userData, organizationId, invitationCode) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: userData },
        });
        if (authError) throw authError;

        const newUser = authData.user;
        if (!newUser) throw new Error("Cadastro falhou, usuário não retornado.");

        const { error: rpcError } = await supabase.rpc('finalize_registration', {
            p_user_id: newUser.id,
            p_organization_id: organizationId,
            p_role: userData.role,
            p_invitation_code: invitationCode
        });

        if (rpcError) {
            console.error("Erro ao finalizar o cadastro (RPC):", rpcError);
            throw new Error("Seu usuário foi criado, mas houve um erro ao vinculá-lo à organização.");
        }
        
        return authData;
    };

    const value = {
        user,
        profile,
        loading,
        signIn,
        signOut,
        signUp,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};