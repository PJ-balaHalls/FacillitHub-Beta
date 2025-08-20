// src/pages/Cadastro.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/alunoService';
import { validateInvitationCode, linkUserToOrganization, markCodeAsUsed } from '../services/organizationService';
import { FiUser, FiMail, FiLock, FiArrowRight, FiBriefcase, FiBookOpen, FiHash } from 'react-icons/fi';

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
    const [flow, setFlow] = useState(null); // 'personal' ou 'institutional'
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryDetailsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, category_details: { ...prev.category_details, [name]: value } }));
    };
    
    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const codeData = await validateInvitationCode(invitationCode);
        if (codeData) {
            setValidCodeData(codeData);
            setFormData(prev => ({ ...prev, user_category: codeData.role }));
            setFlow('institutional');
        } else {
            setError('Código inválido ou já utilizado. Tente novamente.');
        }
        setLoading(false);
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const restartFlow = () => { setFlow(null); setStep(1); setError(''); }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // 1. Criar o usuário no Supabase Auth
            const { data: { user }, error: authError } = await signUp({ email: formData.email, password: formData.password });
            if (authError) throw authError;
            if (!user) throw new Error('O usuário não foi criado.');
            
            // 2. Preparar e atualizar o perfil do usuário
            const profileData = {
                full_name: formData.full_name, nickname: formData.nickname, user_category: formData.user_category,
                pronoun: formData.pronoun, birth_date: formData.birth_date, category_details: formData.category_details,
            };
            await updateUserProfile(user.id, profileData);

            // 3. Se for fluxo institucional, vincular à organização e marcar código como usado
            if (flow === 'institutional' && validCodeData) {
                await linkUserToOrganization(user.id, validCodeData.organization_id, validCodeData.role);
                await markCodeAsUsed(validCodeData.id, user.id);
            }

            setMessage('Cadastro concluído! Verifique seu e-mail para confirmar a conta.');
            setTimeout(() => navigate('/login'), 5000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // CENA 1: Escolha do Fluxo
    if (!flow) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
                <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-primary">Bem-vindo(a) ao Facillit Hub!</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Como você quer começar?</p>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    
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
    
    // Demais cenas (Cadastro Pessoal ou Institucional)
    const totalSteps = flow === 'personal' ? 4 : 3;
    let currentStep = step;
    if (flow === 'institutional') {
        // Ajusta a contagem de passos para o fluxo institucional
        if (step > 1) currentStep = step + 1;
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
            <div className="w-full max-w-lg p-8 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <ProgressBar step={step} totalSteps={totalSteps} />
                {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
                {message && <p className="text-green-500 bg-green-100 dark:bg-green-900/50 p-3 rounded-md text-center">{message}</p>}
                
                <form onSubmit={handleSubmit}>
                    {/* Renderiza os passos com base no fluxo e na etapa atual */}
                    {flow === 'personal' && step === 1 && ( /* CENA 2 Pessoal */
                        <>
                            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Em qual desses grupos você se enquadra?</h2>
                            <div className="space-y-4 pt-4">
                                {['aluno', 'professor', 'autonomo', 'vestibulando'].map(category => (
                                    <button key={category} type="button" onClick={() => { setFormData({...formData, user_category: category}); nextStep(); }}
                                        className="w-full flex items-center gap-4 p-4 border rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 transition-colors">
                                        {category === 'aluno' || category === 'vestibulando' ? <FiBookOpen/> : <FiBriefcase/>}
                                        <span className="capitalize font-medium">{category.replace('_', ' ')}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {(step === 2 && flow === 'personal') || (step === 1 && flow === 'institutional') ? ( /* CENA 3 */
                         <>
                            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Conte-nos um pouco sobre você</h2>
                            <div className="space-y-4 pt-4">
                                <input name="full_name" placeholder="Nome Completo" onChange={handleChange} value={formData.full_name} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                                <input name="nickname" placeholder="Como gostaria de ser chamado(a)?" onChange={handleChange} value={formData.nickname} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                                <input name="pronoun" placeholder="Pronome (Ex: ele/dele, ela/dela)" onChange={handleChange} value={formData.pronoun} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                                <input name="birth_date" type="date" onChange={handleChange} value={formData.birth_date} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                            <button type="button" onClick={nextStep} className="w-full mt-6 py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">Próximo</button>
                        </>
                    ) : null}

                     {(step === 3 && flow === 'personal') || (step === 2 && flow === 'institutional') ? ( /* CENA 4/5/6 */
                         <>
                            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Detalhes Adicionais</h2>
                            <div className="space-y-4 pt-4">
                                {formData.user_category === 'aluno' && (
                                    <>
                                        <input name="serie" placeholder="Sua série/ano" onChange={handleCategoryDetailsChange} value={formData.category_details.serie || ''} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                                        <input name="escola" placeholder="Nome da sua escola" onChange={handleCategoryDetailsChange} value={formData.category_details.escola || ''} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                                    </>
                                )}
                                {formData.user_category === 'vestibulando' && (
                                    <input name="curso_desejado" placeholder="Qual curso você deseja?" onChange={handleCategoryDetailsChange} value={formData.category_details.curso_desejado || ''} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                                )}
                                {/* Adicionar outros campos aqui */}
                            </div>
                            <button type="button" onClick={nextStep} className="w-full mt-6 py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">Próximo</button>
                        </>
                    ) : null}
                    
                    {(step === 4 && flow === 'personal') || (step === 3 && flow === 'institutional') ? ( /* CENA FINAL */
                        <>
                            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Para finalizar, crie seu acesso</h2>
                            <div className="space-y-4 pt-4">
                                <div className="relative"><FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" /><input name="email" type="email" placeholder="Seu melhor e-mail" onChange={handleChange} value={formData.email} required className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/></div>
                                <div className="relative"><FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" /><input name="password" type="password" placeholder="Crie uma senha forte" minLength="6" onChange={handleChange} value={formData.password} required className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/></div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full mt-6 py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">{loading ? 'Finalizando...' : 'Criar Conta'}</button>
                        </>
                    ) : null}
                </form>

                {step > 1 && !message && (
                    <button type="button" onClick={prevStep} className="w-full mt-2 py-2 px-4 text-gray-600 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Voltar</button>
                )}
                 {!message && <button type="button" onClick={restartFlow} className="w-full mt-2 py-2 px-4 text-sm text-gray-500 hover:underline">Reiniciar Cadastro</button>}
            </div>
        </div>
    );
};

export default Cadastro;