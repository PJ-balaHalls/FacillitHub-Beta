// src/pages/Cadastro.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// <<< CORREÇÃO AQUI: O ícone FiUser foi removido da importação
import { FiMail, FiLock } from 'react-icons/fi';

const Cadastro = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const { error } = await signUp({ email, password });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
            // Opcional: redirecionar após um tempo
            setTimeout(() => navigate('/login'), 5000);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary">Crie sua Conta</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Comece sua jornada no Facillit Hub.</p>
                </div>
                {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
                {message && <p className="text-green-500 bg-green-100 dark:bg-green-900/50 p-3 rounded-md text-center">{message}</p>}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Crie uma senha forte"
                            required
                            minLength="6"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 disabled:bg-gray-400"
                        >
                            {loading ? 'Criando conta...' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
                <div className="text-center text-gray-600 dark:text-gray-400">
                    <p>Já tem uma conta? <Link to="/login" className="font-medium text-primary hover:underline">Faça login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;