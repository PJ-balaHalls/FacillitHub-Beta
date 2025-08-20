// src/components/GeradorCodigo.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMinhaOrganizacao } from '../services/organizationService';
import PreCadastroAlunoModal from './PreCadastroAlunoModal'; // Importa o modal
import { FiCopy } from 'react-icons/fi';

const GeradorCodigo = () => {
    const { user } = useAuth();
    const [organization, setOrganization] = useState(null);
    const [ultimoCodigo, setUltimoCodigo] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrganization = async () => {
            if (user) {
                setLoading(true);
                const org = await getMinhaOrganizacao(user.id);
                setOrganization(org);
                setLoading(false);
            }
        };
        fetchOrganization();
    }, [user]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ultimoCodigo);
        alert('Código copiado para a área de transferência!');
    };

    if (loading) {
        return <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">Carregando dados...</div>;
    }
    
    if (!organization) {
        return null; // Não mostra nada se o professor não tiver organização
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Gerenciar Turma</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Clique no botão para pré-cadastrar um novo aluno e gerar um código de acesso para a turma de <span className="font-bold">{organization.name}</span>.</p>
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300"
                >
                    Pré-cadastrar Aluno
                </button>

                {ultimoCodigo && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Código gerado com sucesso! Entregue ao aluno:</p>
                        <div className="flex items-center justify-between">
                             <span className="font-mono text-2xl text-primary font-bold tracking-widest">{ultimoCodigo}</span>
                            <button onClick={copyToClipboard} title="Copiar Código" className="p-2 text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-white">
                                <FiCopy size={20}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <PreCadastroAlunoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                organization={organization}
                onCodeGenerated={(codigo) => {
                    setUltimoCodigo(codigo);
                }}
            />
        </>
    );
};

export default GeradorCodigo;