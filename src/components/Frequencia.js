// src/pages/Frequencia.js
import React, { useState } from 'react';
import { dadosAlunos } from '../data/alunos'; // Usando nossos dados centralizados

const Frequencia = () => {
    const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().slice(0, 10));
    const [frequenciaDiaria, setFrequenciaDiaria] = useState({});

    const handleStatusChange = (alunoId, status) => {
        setFrequenciaDiaria(prev => ({
            ...prev,
            [alunoId]: status,
        }));
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
                        className="p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    />
                    <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                        Salvar Chamada
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-gray-700">
                        <tr>
                            <th className="p-4">Aluno</th>
                            <th className="p-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosAlunos.map((aluno) => (
                            <tr key={aluno.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={aluno.avatar} alt={aluno.nome} className="w-10 h-10 rounded-full" />
                                    <span className="font-medium">{aluno.nome}</span>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        {statusOptions.map(opt => (
                                            <button 
                                                key={opt.value}
                                                onClick={() => handleStatusChange(aluno.id, opt.value)}
                                                className={`w-8 h-8 rounded-full text-white font-bold text-sm transition-all duration-200 
                                                    ${frequenciaDiaria[aluno.id] === opt.value ? `${opt.color} scale-110 shadow-lg` : `bg-gray-300 dark:bg-gray-600 ${opt.hover}`}
                                                `}
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
             <div className="mt-4 flex items-center gap-6 p-2 rounded-lg bg-white dark:bg-gray-800 w-fit">
                <h3 className="font-semibold text-sm">Legenda:</h3>
                {statusOptions.map(opt => (
                    <div key={opt.value} className="flex items-center gap-2 text-sm">
                        <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold ${opt.color}`}>{opt.label}</div>
                        <span>{opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Frequencia;