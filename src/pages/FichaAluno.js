// src/pages/FichaAluno.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import GraficoDesempenho from '../components/GraficoDesempenho';
import CalendarioPresenca from '../components/CalendarioPresenca';
import { getAlunoById } from '../services/alunoService'; // <<< PONTO CHAVE: Busca um único aluno

const FichaAluno = () => {
    const { alunoId } = useParams();
    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarAluno = async () => {
            setLoading(true);
            const data = await getAlunoById(alunoId);
            setAluno(data);
            setLoading(false);
        };
        if (alunoId) {
            carregarAluno();
        }
    }, [alunoId]);

    if (loading) {
        return <div className="p-6">Carregando ficha do aluno...</div>;
    }

    if (!aluno) {
        return (
            <div className="p-6">
                <h1 className="text-2xl text-gray-800 dark:text-white">Aluno não encontrado!</h1>
                <Link to="/notas" className="text-primary hover:underline">Voltar para a lista</Link>
            </div>
        );
    }
    
    // Função para renderizar detalhes do bimestre (sem alterações)
    const renderBimestreDetails = (bimestre, nomeBimestre) => {
        if (!bimestre || bimestre.length === 0) {
            return (
                <div className="p-4 border rounded-lg dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{nomeBimestre}</h3>
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma avaliação lançada.</p>
                </div>
            );
        }
        
        const totalNota = bimestre.reduce((acc, aval) => acc + (aval.nota || 0), 0);
        const totalMax = bimestre.reduce((acc, aval) => acc + (aval.valorMax || 0), 0);

        return (
            <div className="p-4 border rounded-lg dark:border-gray-700">
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{nomeBimestre}</h3>
                {bimestre.map(aval => (
                     <p key={aval.id} className="text-gray-600 dark:text-gray-300">{aval.nome} ({aval.valorMax} pts): <span className="font-medium text-gray-900 dark:text-white">{aval.nota}</span></p>
                ))}
                <hr className="my-2 dark:border-gray-700" />
                <p className="font-bold text-gray-800 dark:text-white">Total: <span className="text-primary">{totalNota} / {totalMax}</span></p>
            </div>
        );
    };

    // O restante do componente JSX permanece o mesmo, mas agora usando os dados do 'aluno' do state
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <Link to="/notas" className="text-sm text-primary hover:underline mb-2 block">&larr; Voltar para a lista</Link>
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">{aluno.full_name}</h1>
                </div>
                <div className="flex gap-2">
                    {/* As funções de imprimir e exportar podem ser mantidas como estão */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <img src={aluno.avatar_url || `https://i.pravatar.cc/100?u=${aluno.id}`} alt={aluno.full_name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-white">{aluno.full_name}</h2>
                        <p className="text-gray-600 dark:text-gray-300"><strong>Turma:</strong> {aluno.turma || 'Não informado'}</p>
                        <p className="text-gray-600 dark:text-gray-300"><strong>Contato:</strong> {aluno.contato || 'Não informado'}</p>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Anotações do Professor</h2>
                        <p className="text-gray-600 dark:text-gray-300">{aluno.anotacoes || 'Nenhuma anotação.'}</p>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Desempenho Detalhado (Pontos)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderBimestreDetails(aluno.notas.b1, 'Bimestre 1')}
                            {renderBimestreDetails(aluno.notas.b2, 'Bimestre 2')}
                            {renderBimestreDetails(aluno.notas.b3, 'Bimestre 3')}
                            {renderBimestreDetails(aluno.notas.b4, 'Bimestre 4')}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Evolução Geral</h2>
                        <GraficoDesempenho data={aluno.notas} />
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Calendário de Frequência</h2>
                <CalendarioPresenca diasDeFalta={aluno.frequencia ? Object.keys(aluno.frequencia).filter(key => aluno.frequencia[key] === 'ausente') : []} />
            </div>
        </div>
    );
};

export default FichaAluno;