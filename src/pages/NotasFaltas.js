import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import LancamentoModal from '../components/LancamentoModal';
import { getAlunos, atualizarAluno } from '../services/alunoService'; // <<< MUDANÇA IMPORTANTE

const NotasFaltas = () => {
    const [alunos, setAlunos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Carrega os dados quando o componente é montado
    useEffect(() => {
        setAlunos(getAlunos());
    }, []);

    const calcularStatus = (notas) => {
        let notaFinal = 0;
        let valorMaxFinal = 0;
        Object.values(notas).forEach(bimestre => {
            if (Array.isArray(bimestre)) {
                bimestre.forEach(aval => {
                    notaFinal += aval.nota || 0;
                    valorMaxFinal += aval.valorMax || 0;
                });
            }
        });
        const percentual = valorMaxFinal > 0 ? (notaFinal / valorMaxFinal) * 100 : 0;
        let status = 'Aprovado';
        if (percentual < 50) status = 'Reprovado';
        else if (percentual < 70) status = 'Recuperação';
        return { notaFinal, valorMaxFinal, status };
    };

    const handleOpenModal = (aluno) => {
        setSelectedStudent(aluno);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const handleSaveData = (studentId, data) => {
        // Usa nosso serviço para atualizar e persistir os dados
        const alunosAtualizados = atualizarAluno(studentId, data);
        setAlunos(alunosAtualizados); // Atualiza o estado local para re-renderizar
        console.log("Dados persistidos no localStorage:", alunosAtualizados);
    };

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Gerenciador de Notas</h1>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 dark:border-gray-700">
                            <tr>
                                <th className="p-4">Aluno</th>
                                <th className="p-4">Nota Final</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunos.map((aluno) => {
                                const { notaFinal, valorMaxFinal, status } = calcularStatus(aluno.notas);
                                return (
                                    <tr key={aluno.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={aluno.avatar} alt={aluno.nome} className="w-10 h-10 rounded-full" />
                                            <span className="font-medium">{aluno.nome}</span>
                                        </td>
                                        <td className="p-4 font-bold">{notaFinal} / {valorMaxFinal}</td>
                                        <td className="p-4"><StatusBadge status={status} /></td>
                                        <td className="p-4 flex gap-4">
                                            <Link to={`/alunos/${aluno.id}`} className="text-primary hover:underline font-semibold">
                                                Ver Ficha
                                            </Link>
                                            <button onClick={() => handleOpenModal(aluno)} className="text-secondary hover:underline font-semibold">
                                                Gerenciar Notas
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <LancamentoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                student={selectedStudent}
                onSave={handleSaveData}
            />
        </>
    );
};

export default NotasFaltas;