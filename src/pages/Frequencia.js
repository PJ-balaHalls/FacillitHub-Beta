import React, { useState, useEffect } from 'react';
import { getAlunos, salvarAlunos } from '../services/alunoService';

const Frequencia = () => {
    const [alunos, setAlunos] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().slice(0, 10));
    const [frequenciaDiaria, setFrequenciaDiaria] = useState({});

    useEffect(() => {
        setAlunos(getAlunos());
    }, []);
    
    useEffect(() => {
        const frequenciaSalva = {};
        alunos.forEach(aluno => {
            if (aluno.frequencia && aluno.frequencia[dataSelecionada]) {
                frequenciaSalva[aluno.id] = aluno.frequencia[dataSelecionada];
            }
        });
        setFrequenciaDiaria(frequenciaSalva);
    }, [dataSelecionada, alunos]);

    const handleStatusChange = (alunoId, status) => {
        setFrequenciaDiaria(prev => ({
            ...prev,
            [alunoId]: status,
        }));
    };

    const handleSalvarChamada = () => {
        let alunosAtualizados = getAlunos();

        alunosAtualizados.forEach(aluno => {
            if(frequenciaDiaria[aluno.id]) {
                if(!aluno.frequencia) {
                    aluno.frequencia = {};
                }
                aluno.frequencia[dataSelecionada] = frequenciaDiaria[aluno.id];
            }
        });

        // Persiste a lista completa de alunos com os novos dados de frequência
        salvarAlunos(alunosAtualizados); 
        setAlunos(alunosAtualizados);
        
        console.log("Salvando chamada para o dia:", dataSelecionada);
        console.log("Dados:", frequenciaDiaria);
        alert("Chamada salva com sucesso (verifique o console)!");
    };

    const statusOptions = [
        { value: 'presente', label: 'P', color: 'bg-green-500', hover: 'hover:bg-green-600' },
        { value: 'ausente', label: 'A', color: 'bg-red-500', hover: 'hover:bg-red-600' },
        { value: 'atestado', label: 'J', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Controle de Frequência</h1>
                <div className="flex items-center gap-4">
                    <input 
                        type="date" 
                        value={dataSelecionada}
                        onChange={(e) => setDataSelecionada(e.target.value)}
                        className="p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                    />
                    <button 
                        onClick={handleSalvarChamada}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Salvar Chamada
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead className="border-b-2 dark:border-gray-700">
                        <tr>
                            <th className="p-4 text-lg">Aluno</th>
                            <th className="p-4 text-center text-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map((aluno) => (
                            <tr key={aluno.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                <td className="p-4 flex items-center gap-4">
                                    <img src={aluno.avatar} alt={aluno.nome} className="w-12 h-12 rounded-full" />
                                    <span className="font-medium text-base">{aluno.nome}</span>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        {statusOptions.map(opt => (
                                            <button 
                                                key={opt.value}
                                                onClick={() => handleStatusChange(aluno.id, opt.value)}
                                                className={`w-10 h-10 rounded-full text-white font-bold text-lg transition-all duration-200 
                                                    ${frequenciaDiaria[aluno.id] === opt.value ? `${opt.color} scale-110 ring-4 ring-opacity-50 ring-blue-400` : `bg-gray-300 dark:bg-gray-600 ${opt.hover}`}
                                                `}
                                                title={opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6 flex items-center gap-6 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm w-fit">
                <h3 className="font-semibold text-md">Legenda:</h3>
                {statusOptions.map(opt => (
                    <div key={opt.value} className="flex items-center gap-2 text-sm">
                        <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-base ${opt.color}`}>{opt.label}</div>
                        <span>{opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Frequencia;