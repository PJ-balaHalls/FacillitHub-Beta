import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

const LancamentoModal = ({ isOpen, onClose, student, onSave }) => {
    const [activeTab, setActiveTab] = useState('b1');
    const [formData, setFormData] = useState({ b1: [], b2: [], b3: [], b4: [] });

    useEffect(() => {
        if (student && student.notas) {
            setFormData(JSON.parse(JSON.stringify(student.notas)));
        }
    }, [student]);

    if (!isOpen || !student) return null;

    const handleInputChange = (e, bimestre, id) => {
        const { name, value } = e.target;
        const isNumericField = name === 'nota' || name === 'valorMax';
        const updatedValue = isNumericField ? (Number(value) || 0) : value;

        const updatedBimestre = formData[bimestre].map(aval => 
            aval.id === id ? { ...aval, [name]: updatedValue } : aval
        );
        setFormData(prev => ({ ...prev, [bimestre]: updatedBimestre }));
    };

    const addAvaliacao = (bimestre) => {
        const newAvaliacao = { id: `new_${Date.now()}`, nome: 'Nova Avaliação', valorMax: 10, nota: 0 };
        setFormData(prev => ({ ...prev, [bimestre]: [...(prev[bimestre] || []), newAvaliacao] }));
    };

    const removeAvaliacao = (bimestre, id) => {
        const updatedBimestre = formData[bimestre].filter(aval => aval.id !== id);
        setFormData(prev => ({ ...prev, [bimestre]: updatedBimestre }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(student.id, { notas: formData });
        onClose();
    };
    
    const renderGradeForm = (bimestre) => {
        const avaliacoes = formData[bimestre] || [];
        const total = avaliacoes.reduce((acc, aval) => acc + (aval.nota || 0), 0);
        const valorMaxTotal = avaliacoes.reduce((acc, aval) => acc + (aval.valorMax || 0), 0);

        return (
            <div className="space-y-4">
                {avaliacoes.map((aval) => (
                    <div key={aval.id} className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                        <div className="col-span-5">
                            <label className="text-xs text-gray-500 dark:text-gray-400">Nome da Avaliação</label>
                            <input type="text" name="nome" value={aval.nome} onChange={e => handleInputChange(e, bimestre, aval.id)} className="w-full p-2 rounded-md border bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="col-span-3">
                            <label className="text-xs text-gray-500 dark:text-gray-400">Nota Obtida</label>
                             <input type="number" name="nota" value={aval.nota} onChange={e => handleInputChange(e, bimestre, aval.id)} className="w-full p-2 rounded-md border bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="col-span-3">
                            <label className="text-xs text-gray-500 dark:text-gray-400">Valor Máximo</label>
                            <input type="number" name="valorMax" value={aval.valorMax} onChange={e => handleInputChange(e, bimestre, aval.id)} className="w-full p-2 rounded-md border bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="col-span-1 flex items-end">
                             <button type="button" onClick={() => removeAvaliacao(bimestre, aval.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors duration-200"><FiTrash2 size={18}/></button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={() => addAvaliacao(bimestre)} className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline mt-4 transition-transform hover:scale-105">
                    <FiPlus/> Adicionar Avaliação
                </button>
                <div className="text-right font-bold text-xl text-gray-800 dark:text-white pt-4 border-t-2 dark:border-gray-600">
                    Total do Bimestre: <span className="text-primary text-2xl">{total}</span> / {valorMaxTotal}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Gerenciar Notas de {student.full_name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                     <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex gap-6" aria-label="Tabs">
                            {['b1', 'b2', 'b3', 'b4'].map((bim) => (
                                <button
                                    key={bim}
                                    type="button"
                                    onClick={() => setActiveTab(bim)}
                                    className={`${
                                        activeTab === bim
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-all duration-300`}
                                >
                                    {`Bimestre ${bim.charAt(1)}`}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="pt-6">
                        {renderGradeForm(activeTab)}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-all duration-300 transform hover:scale-105">
                        Cancelar
                    </button>
                    <button type="button" onClick={handleSubmit} className="bg-gradient-to-r from-primary to-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:from-primary-dark hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LancamentoModal;