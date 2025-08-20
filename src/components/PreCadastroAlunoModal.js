// src/components/PreCadastroAlunoModal.js
import React, { useState } from 'react';
import { FiX, FiUser, FiMail, FiCalendar } from 'react-icons/fi';
import { criarCodigoConvite } from '../services/organizationService';

const PreCadastroAlunoModal = ({ isOpen, onClose, organization, onCodeGenerated }) => {
    const [formData, setFormData] = useState({ full_name: '', email: '', birth_date: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Monta o e-mail padrão do Facillit Hub
        const generatedEmail = `${formData.email.toLowerCase().replace(/[^a-z0-9]/g, '')}@facillithub.com`;
        
        const prefilledData = {
            full_name: formData.full_name,
            birth_date: formData.birth_date,
            email: generatedEmail, // Usamos o e-mail gerado
        };
        
        const novoCodigo = await criarCodigoConvite(organization.id, prefilledData);

        if (novoCodigo) {
            onCodeGenerated(novoCodigo.code);
            onClose(); // Fecha o modal após sucesso
        } else {
            setError('Falha ao gerar o código. Tente novamente.');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Pré-cadastrar Novo Aluno</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <FiX size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="relative">
                        <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input name="full_name" placeholder="Nome Completo do Aluno" required onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div className="relative">
                        <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input name="email" placeholder="Crie um login (ex: pedro.maia)" required onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                         <p className="text-xs text-gray-500 pl-2 pt-1">O e-mail final será: {formData.email.toLowerCase().replace(/[^a-z0-9]/g, '')}@facillithub.com</p>
                    </div>
                     <div className="relative">
                        <FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input name="birth_date" type="date" required onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" disabled={loading} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark disabled:opacity-50">
                            {loading ? 'Gerando...' : 'Gerar Código'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreCadastroAlunoModal;