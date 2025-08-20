import React from 'react';
import { useParams, Link } from 'react-router-dom';
import GraficoDesempenho from '../components/GraficoDesempenho';
import CalendarioPresenca from '../components/CalendarioPresenca';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType
} from 'docx';
import { saveAs } from 'file-saver';
import { getAlunos } from '../services/alunoService'; // <<< PONTO CHAVE: Busca os dados do serviço

const FichaAluno = () => {
    const { alunoId } = useParams();
    
    // Carrega TODOS os alunos do serviço e depois encontra o aluno específico
    const alunos = getAlunos();
    const aluno = alunos.find(a => a.id === parseInt(alunoId));

    if (!aluno) {
        return (
            <div className="p-6">
                <h1 className="text-2xl text-gray-800 dark:text-white">Aluno não encontrado!</h1>
                <Link to="/notas" className="text-primary hover:underline">Voltar para a lista</Link>
            </div>
        );
    }

    const handleExportWord = () => {
        const headerTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph(`Nome do Aluno: ${aluno.nome}`)],
                            width: { size: 40, type: WidthType.PERCENTAGE },
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        }),
                        new TableCell({
                            children: [new Paragraph(`RA: ${aluno.ra}`)],
                            width: { size: 35, type: WidthType.PERCENTAGE },
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        }),
                        new TableCell({
                            children: [new Paragraph(`Ano Letivo: ${aluno.anoLetivo}`)],
                            width: { size: 25, type: WidthType.PERCENTAGE },
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph(`Escola: ${aluno.escola}`)],
                            width: { size: 40, type: WidthType.PERCENTAGE },
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        }),
                        new TableCell({
                            children: [new Paragraph(`Turma: ${aluno.turma}`)],
                            width: { size: 60, type: WidthType.PERCENTAGE },
                            columnSpan: 2,
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        }),
                    ],
                }),
            ],
        });

        const gradeHeader = new TableRow({
            tableHeader: true,
            children: [
                new TableCell({
                    children: [new Paragraph({ text: "Disciplina", alignment: AlignmentType.CENTER })],
                    shading: { type: ShadingType.SOLID, color: "D9D9D9" },
                    verticalAlign: "center",
                }),
                new TableCell({
                    children: [new Paragraph({ text: "1º Bimestre", alignment: AlignmentType.CENTER })],
                    columnSpan: 2,
                    shading: { type: ShadingType.SOLID, color: "D9D9D9" },
                }),
                new TableCell({
                    children: [new Paragraph({ text: "2º Bimestre", alignment: AlignmentType.CENTER })],
                    columnSpan: 2,
                    shading: { type: ShadingType.SOLID, color: "D9D9D9" },
                }),
            ],
        });

        const subHeader = new TableRow({
            tableHeader: true,
            children: [
                new TableCell({ children: [], borders: { top: { style: BorderStyle.NONE } } }),
                new TableCell({ children: [new Paragraph({ text: "N", alignment: AlignmentType.CENTER })], shading: { type: ShadingType.SOLID, color: "D9D9D9" } }),
                new TableCell({ children: [new Paragraph({ text: "F", alignment: AlignmentType.CENTER })], shading: { type: ShadingType.SOLID, color: "D9D9D9" } }),
                new TableCell({ children: [new Paragraph({ text: "N", alignment: AlignmentType.CENTER })], shading: { type: ShadingType.SOLID, color: "D9D9D9" } }),
                new TableCell({ children: [new Paragraph({ text: "F", alignment: AlignmentType.CENTER })], shading: { type: ShadingType.SOLID, color: "D9D9D9" } }),
            ],
        });
        
        const dataRows = aluno.disciplinas.map(disciplina =>
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph(disciplina.nome)] }),
                    new TableCell({ children: [new Paragraph({ text: String(disciplina.notas.b1 || '-'), alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: String(disciplina.faltas.b1 || '-'), alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: String(disciplina.notas.b2 || '-'), alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: String(disciplina.faltas.b2 || '-'), alignment: AlignmentType.CENTER })] }),
                ],
            })
        );

        const gradesTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [gradeHeader, subHeader, ...dataRows],
        });
        
        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: "Boletim Escolar", bold: true, size: 32, })],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({ text: " " }),
                    headerTable,
                    new Paragraph({ text: " " }),
                    gradesTable,
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `boletim_${aluno.nome}.docx`);
        });
    };
    
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

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <Link to="/notas" className="text-sm text-primary hover:underline mb-2 block">&larr; Voltar para a lista</Link>
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">{aluno.nome}</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Imprimir</button>
                    <button onClick={handleExportWord} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">Exportar DOCX</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <img src={aluno.avatar} alt={aluno.nome} className="w-24 h-24 rounded-full mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-white">{aluno.nome}</h2>
                        <p className="text-gray-600 dark:text-gray-300"><strong>Turma:</strong> {aluno.turma}</p>
                        <p className="text-gray-600 dark:text-gray-300"><strong>Contato:</strong> {aluno.contato}</p>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Anotações do Professor</h2>
                        <p className="text-gray-600 dark:text-gray-300">{aluno.anotacoes}</p>
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