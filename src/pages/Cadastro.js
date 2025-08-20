// src/pages/Cadastro.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/alunoService';
import { FiUser, FiMail, FiLock, FiArrowRight, FiBriefcase, FiBookOpen } from 'react-icons/fi';

// Componente para a barra de progresso
const ProgressBar = ({ step }) => {
    const progress = (step / 4) * 100;
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
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        user_category: '',
        full_name: '',
        nickname: '',
        pronoun: '',
        birth_date: '',
        category_details: {}
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
        setFormData(prev => ({
            ...prev,
            category_details: {
                ...prev.category_details,
                [name]: value
            }
        }));
    };
    
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // 1. Criar o usuário no Supabase Auth
            const { data: authData, error: authError } = await signUp({ 
                email: formData.email, 
                password: formData.password 
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('O usuário não foi criado.');
            
            // 2. Preparar os dados para a tabela 'profiles'
            const profileData = {
                full_name: formData.full_name,
                nickname: formData.nickname,
                user_category: formData.user_category,
                pronoun: formData.pronoun,
                birth_date: formData.birth_date,
                category_details: formData.category_details,
            };

            // 3. Atualizar o perfil do usuário recém-criado
            await updateUserProfile(authData.user.id, profileData);

            setMessage('Cadastro concluído com sucesso! Verifique seu e-mail para confirmar a conta.');
            setTimeout(() => navigate('/login'), 5000);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const renderStep = () => {
        switch(step) {
            case 1: // CENA 2: Perfil (Segmentação)
                return (
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
                );
            case 2: // CENA 3: Informações Pessoais
                return (
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
                );
            case 3: // CENA 4/5/6: Detalhes da Categoria
                return (
                     <>
                        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Detalhes Adicionais</h2>
                        <div className="space-y-4 pt-4">
                            {/* Renderiza campos com base na categoria escolhida */}
                            {formData.user_category === 'aluno' && (
                                <>
                                    <input name="serie" placeholder="Sua série/ano" onChange={handleCategoryDetailsChange} value={formData.category_details.serie || ''} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                                    <input name="escola" placeholder="Nome da sua escola" onChange={handleCategoryDetailsChange} value={formData.category_details.escola || ''} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                                </>
                            )}
                             {formData.user_category === 'vestibulando' && (
                                <input name="curso_desejado" placeholder="Qual curso você deseja?" onChange={handleCategoryDetailsChange} value={formData.category_details.curso_desejado || ''} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                            )}
                            {/* Adicionar outros campos para 'professor', etc. aqui */}
                        </div>
                        <button type="button" onClick={nextStep} className="w-full mt-6 py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">Próximo</button>
                    </>
                );
            case 4: // CENA FINAL: Dados de Autenticação
                return (
                    <>
                        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Para finalizar, crie seu acesso</h2>
                        <div className="space-y-4 pt-4">
                            <div className="relative">
                                <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                <input name="email" type="email" placeholder="Seu melhor e-mail" onChange={handleChange} value={formData.email} required className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                            <div className="relative">
                                <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                <input name="password" type="password" placeholder="Crie uma senha forte" minLength="6" onChange={handleChange} value={formData.password} required className="w-full pl-10 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full mt-6 py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                            {loading ? 'Finalizando...' : 'Criar Conta'}
                        </button>
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
            <div className="w-full max-w-lg p-8 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <ProgressBar step={step} />
                {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
                {message && <p className="text-green-500 bg-green-100 dark:bg-green-900/50 p-3 rounded-md text-center">{message}</p>}
                
                <form onSubmit={handleSubmit}>
                    {renderStep()}
                </form>

                {step > 1 && !message && (
                    <button type="button" onClick={prevStep} className="w-full mt-2 py-2 px-4 text-gray-600 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Voltar
                    </button>
                )}

                <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4">
                    <p>Já tem uma conta? <Link to="/login" className="font-medium text-primary hover:underline">Faça login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;