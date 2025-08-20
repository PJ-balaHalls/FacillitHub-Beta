// src/pages/Cadastro.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateInvitationCode } from '../services/organizationService';
import { FaKey, FaUserPlus, FaLock, FaUserCircle } from 'react-icons/fa';

const Cadastro = () => {
    const [step, setStep] = useState(1);
    const [codigo, setCodigo] = useState('');
    const [prefilledData, setPrefilledData] = useState(null);
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [organizationId, setOrganizationId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        if (!codigo || codigo.trim() === '') {
            setError('Por favor, insira um código de convite para continuar.');
            return;
        }
        setIsLoading(true);
        try {
            const data = await validateInvitationCode(codigo);
            if (data) {
                setPrefilledData(data.prefilled_data);
                setRole(data.role);
                setOrganizationId(data.organization_id);
                setStep(2);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalizarCadastro = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError("As senhas não coincidem!");
            return;
        }
        if (!nickname.trim()) {
            setError("O apelido é obrigatório.");
            return;
        }
        
        setIsLoading(true);
        try {
            const userData = {
                full_name: prefilledData.full_name,
                nickname: nickname,
                role: role, 
            };
            
            // CORREÇÃO: Agora passamos o 'codigo' que está no estado do componente.
            await signUp(prefilledData.email, password, userData, organizationId, codigo);
            
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Cole o resto do seu componente aqui (renderStepOne, renderStepTwo, etc.)
    const renderStepOne = () => (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <FaKey className="mx-auto text-5xl text-blue-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Acesso Institucional</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Insira o código de convite que você recebeu.</p>
            </div>
            <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Insira seu código"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
                >
                    {isLoading ? 'Verificando...' : 'Verificar Código'}
                </button>
            </form>
        </div>
    );

    const renderStepTwo = () => (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <FaUserPlus className="mx-auto text-5xl text-green-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Complete seu Cadastro</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Confirme seus dados e crie sua senha de acesso.</p>
            </div>
            <form onSubmit={handleFinalizarCadastro} className="space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nome Completo</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{prefilledData?.full_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">E-mail</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{prefilledData?.email}</p>
                </div>

                <div className="relative">
                    <FaUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Crie um apelido" value={nickname} onChange={(e) => setNickname(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" placeholder="Crie uma senha" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" placeholder="Confirme sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 disabled:bg-green-300"
                >
                    {isLoading ? 'Finalizando...' : 'Finalizar Cadastro'}
                </button>
            </form>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            {step === 1 ? renderStepOne() : renderStepTwo()}
        </div>
    );
};

export default Cadastro;