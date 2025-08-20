// src/components/GeradorCodigo.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMinhaOrganizacao, criarCodigoConvite } from '../services/organizationService';
import { FiCopy } from 'react-icons/fi';

const GeradorCodigo = () => {
    const { user } = useAuth();
    const [organization, setOrganization] = useState(null);
    const [ultimoCodigo, setUltimoCodigo] = useState('');
    const [loading, setLoading] = useState(true); // Inicia como true para mostrar que está carregando
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrganization = async () => {
            if (user) {
                try {
                    const org = await getMinhaOrganizacao(user.id);
                    setOrganization(org);
                } catch (e) {
                    setError('Falha ao buscar dados da organização.');
                } finally {
                    setLoading(false); // Finaliza o carregamento
                }
            }
        };
        fetchOrganization();
    }, [user]);

    const handleGerarCodigo = async () => {
        if (!organization) {
            setError('Você não está vinculado a uma organização para gerar códigos.');
            return;
        }
        setLoading(true);
        setError('');
        const novoCodigo = await criarCodigoConvite(organization.id, user.id);
        if (novoCodigo) {
            setUltimoCodigo(novoCodigo.code);
        } else {
            setError('Não foi possível gerar o código. Tente novamente.');
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ultimoCodigo);
        alert('Código copiado para a área de transferência!');
    };

    // <<< MELHORIA AQUI >>>
    // Mostra um estado de carregamento enquanto busca a organização
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Gerenciar Turma</h2>
                <p className="text-gray-600 dark:text-gray-300">Carregando dados da organização...</p>
            </div>
        );
    }
    
    // Mostra uma mensagem amigável se o professor não estiver em nenhuma organização
    if (!organization) {
        return (
            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Ação Necessária</h2>
                <p className="text-yellow-700 dark:text-yellow-300">Para gerar códigos de convite, sua conta de professor precisa estar vinculada a uma instituição. Entre em contato com o administrador.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Gerenciar Turma</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Gere um código de convite para seus alunos se cadastrarem na turma de: <span className="font-bold">{organization.name}</span>.</p>
            
            <button
                onClick={handleGerarCodigo}
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300 disabled:opacity-50"
            >
                {loading ? 'Gerando...' : 'Gerar Novo Código'}
            </button>
            
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {ultimoCodigo && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                    <span className="font-mono text-2xl text-primary font-bold tracking-widest">{ultimoCodigo}</span>
                    <button onClick={copyToClipboard} title="Copiar Código" className="p-2 text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-white">
                        <FiCopy size={20}/>
                    </button>
                </div>
            )}
        </div>
    );
};

export default GeradorCodigo;