// src/pages/Cadastro.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <<< LINHA QUE FALTAVA
import { updateUserProfile } from '../services/alunoService';
import { validateInvitationCode, linkUserToOrganization, markCodeAsUsed } from '../services/organizationService';
import { FiMail, FiLock, FiHash, FiUser, FiBriefcase, FiBookOpen } from 'react-icons/fi';

const ProgressBar = ({ step, totalSteps }) => {
    const progress = step > 0 ? (step / totalSteps) * 100 : 0;
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

    useEffect(() => {
        console.log("ESTADO ATUAL DO FORMULÁRIO:", formData);
    }, [formData]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCategoryDetailsChange = (e) => {
        setFormData(prev => ({ ...prev, category_details: { ...prev.category_details, [e.target.name]: e.target.value } }));
    };
    
    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const codeData = await validateInvitationCode(invitationCode);

        console.log("Dados do código recebidos do Supabase:", codeData);

        if (codeData && codeData.prefilled_data) {
            setValidCodeData(codeData);
            setFormData(prev => ({ ...prev, ...codeData.prefilled_data, user_category: codeData.role }));
            setFlow('institutional');
            setStep(1);
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
        
        console.log("DADOS FINAIS SENDO ENVIADOS PARA SIGNUP:", { email: formData.email, password: formData.password });
        
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
    
    const renderPersonalFlow = () => {
        // ... (código do fluxo pessoal, sem alterações)
    };

    const renderInstitutionalFlow = () => {
        if (step === 1) {
            return (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Finalize seu Cadastro</h2>
                    <p className="text-center text-gray-500 dark:text-gray-400">Confirme seus dados e crie sua senha de acesso.</p>
                    
                    <div className="text-left space-y-2 mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300"><strong className="font-medium">Nome Completo:</strong> {formData.full_name}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong className="font-medium">E-mail de Acesso:</strong> {formData.email}</p>
                    </div>
                    <hr className="dark:border-gray-600 my-4"/>

                    <div className="relative"><FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" /><input name="nickname" placeholder="Como gostaria de ser chamado(a)?" onChange={handleChange} value={formData.nickname || ''} required className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/></div>
                    <div className="relative"><FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" /><input name="password" type="password" placeholder="Crie uma senha de acesso" minLength="6" onChange={handleChange} required className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/></div>
                    
                    <button type="submit" disabled={loading} className="w-full mt-6 py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">{loading ? 'Finalizando...' : 'Concluir Cadastro'}</button>
                </form>
            );
        }
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
            {!flow ? (
                 <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-primary">Bem-vindo(a)!</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Como você quer começar?</p>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/50 p-2 rounded-md">{error}</p>}
                    
                    <button onClick={() => { setFlow('personal'); setStep(1); }} className="w-full py-3 px-4 bg-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                        Criar uma conta pessoal
                    </button>

                    <div className="relative flex py-3 items-center"><div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div><span className="flex-shrink mx-4 text-gray-400">ou</span><div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div></div>

                    <form onSubmit={handleCodeSubmit} className="space-y-4">
                        <div className="relative">
                           <FiHash className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input placeholder="Tenho um código de convite" value={invitationCode} onChange={(e) => setInvitationCode(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <button type="submit" disabled={loading || !invitationCode} className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {loading ? 'Validando...' : 'Entrar com Código'}
                        </button>
                    </form>
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400"><p>Já tem uma conta? <Link to="/login" className="font-medium text-primary hover:underline">Faça login</Link></p></div>
                </div>
            ) : (
                <div className="w-full max-w-lg p-8 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <ProgressBar step={step} totalSteps={flow === 'personal' ? 4 : 1} />
                    {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
                    {message && <p className="text-green-500 bg-green-100 dark:bg-green-900/50 p-3 rounded-md text-center">{message}</p>}
                    
                    {flow === 'personal' && <form onSubmit={handleSubmit} className="space-y-4">{renderPersonalFlow()}</form>}
                    {flow === 'institutional' && renderInstitutionalFlow()}

                    {!message && (
                        <div className="pt-4 space-y-2">
                            {flow === 'personal' && step > 1 && <button type="button" onClick={prevStep} className="w-full py-2 px-4 text-gray-600 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Voltar</button>}
                            <button type="button" onClick={restartFlow} className="w-full text-sm text-gray-500 hover:underline">Voltar ao Início</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cadastro;