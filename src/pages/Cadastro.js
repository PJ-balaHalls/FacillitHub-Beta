// src/pages/Cadastro.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/alunoService';
import { validateInvitationCode, linkUserToOrganization, markCodeAsUsed } from '../services/organizationService';
import { FiMail, FiLock, FiHash, FiUser } from 'react-icons/fi';

const ProgressBar = ({ step, totalSteps }) => {
    const progress = (step / totalSteps) * 100;
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
            <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

const Cadastro = () => {
    const [flow, setFlow] = useState(null);
    const [step, setStep] = useState(1);
    const [invitationCode, setInvitationCode] = useState('');
    const [validCodeData, setValidCodeData] = useState(null);
    
    const [formData, setFormData] = useState({
        email: '', password: '', user_category: '',
        full_name: '', nickname: '', pronoun: '',
        birth_date: '', category_details: {}
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const codeData = await validateInvitationCode(invitationCode);
        if (codeData && codeData.prefilled_data) {
            setValidCodeData(codeData);
            setFormData(prev => ({ ...prev, ...codeData.prefilled_data, user_category: codeData.role }));
            setFlow('institutional');
            setStep(2);
        } else {
            setError('Código inválido, já utilizado ou não contém dados de pré-cadastro.');
        }
        setLoading(false);
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const restartFlow = () => { setFlow(null); setStep(1); setError(''); }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data: { user }, error: authError } = await signUp({
                email: formData.email,
                password: formData.password
            });

            if (authError) throw authError;
            if (!user) throw new Error('O usuário não foi criado.');

            const profileData = {
                full_name: formData.full_name,
                birth_date: formData.birth_date,
                nickname: formData.nickname,
                pronoun: formData.pronoun,
                user_category: formData.user_category,
                category_details: formData.category_details,
            };

            await updateUserProfile(user.id, profileData);

            // <<< CORREÇÃO AQUI: Executa este bloco apenas para o fluxo institucional >>>
            if (flow === 'institutional' && validCodeData) {
                await linkUserToOrganization(user.id, validCodeData.organization_id, validCodeData.role);
                await markCodeAsUsed(validCodeData.id, user.id);
            }

            setMessage('Cadastro concluído! Verifique seu e-mail para confirmar a conta. Você será redirecionado.');
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            setError(err.message || 'Ocorreu um erro.');
        } finally {
            setLoading(false);
        }
    };

    // O restante do código permanece o mesmo...

    // CENA 1: Escolha do Fluxo
    if (!flow) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
                <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-primary">Bem-vindo(a) ao Facillit Hub!</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Como você quer começar?</p>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/50 p-2 rounded-md">{error}</p>}
                    
                    <button onClick={() => setFlow('personal')} className="w-full py-3 px-4 bg-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                        Criar uma conta pessoal
                    </button>

                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-400">ou</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <form onSubmit={handleCodeSubmit} className="space-y-4">
                        <div className="relative">
                           <FiHash className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input
                                placeholder="Tenho um código de convite"
                                value={invitationCode}
                                onChange={(e) => setInvitationCode(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <button type="submit" disabled={loading || !invitationCode} className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {loading ? 'Validando...' : 'Entrar com Código'}
                        </button>
                    </form>
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400"><p>Já tem uma conta? <Link to="/login" className="font-medium text-primary hover:underline">Faça login</Link></p></div>
                </div>
            </div>
        );
    }
    
    const totalSteps = flow === 'personal' ? 4 : 2;
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
            <div className="w-full max-w-lg p-8 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <ProgressBar step={step} totalSteps={totalSteps} />
                {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
                {message && <p className="text-green-500 bg-green-100 dark:bg-green-900/50 p-3 rounded-md text-center">{message}</p>}
                
                <form onSubmit={handleSubmit}>
                    {/* Renderiza os passos com base no fluxo e na etapa atual */}
                </form>

                {/* Botões e links de navegação */}
            </div>
        </div>
    );
};

export default Cadastro;