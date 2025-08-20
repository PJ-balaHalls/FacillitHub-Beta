// src/data/alunos.js

export let dadosAlunos = [
    {
        id: 1,
        nome: 'Ana Clara Souza',
        avatar: 'https://i.pravatar.cc/100?img=1',
        turma: '8º Ano B',
        escola: 'E.E. Facillit Hub School',
        ra: '000123456-7/SP',
        anoLetivo: '2025',
        contato: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123',
        notas: { 
            b1: [
                { id: 'p1_1', nome: 'Prova Mensal', valorMax: 15, nota: 13 },
                { id: 't1_1', nome: 'Trabalho em Grupo', valorMax: 10, nota: 10 }
            ],
            b2: [
                { id: 'p2_1', nome: 'Prova Bimestral', valorMax: 20, nota: 18 },
                { id: 'a2_1', nome: 'Atividade Surpresa', valorMax: 5, nota: 5 }
            ],
            b3: [],
            b4: []
        },
        frequencia: {
            '2025-08-18': 'presente',
            '2025-08-19': 'presente',
            '2025-08-20': 'ausente',
        }
    },
    {
        id: 2,
        nome: 'Bruno Martins',
        avatar: 'https://i.pravatar.cc/100?img=2',
        turma: '8º Ano B',
        escola: 'E.E. Facillit Hub School',
        ra: '000123456-8/SP',
        anoLetivo: '2025',
        contato: '(11) 91234-5678',
        endereco: 'Av. Principal, 456',
        notas: { 
            b1: [
                { id: 'p1_2', nome: 'Prova Mensal', valorMax: 15, nota: 10 },
                { id: 't1_2', nome: 'Trabalho em Grupo', valorMax: 10, nota: 8 }
            ],
            b2: [],
            b3: [],
            b4: []
        },
        frequencia: {
            '2025-08-18': 'presente',
            '2025-08-19': 'atestado',
            '2025-08-20': 'presente',
        }
    },
];

// Função para permitir a "atualização" dos nossos dados estáticos (simula um backend)
export const atualizarDadosAluno = (id, novosDados) => {
    dadosAlunos = dadosAlunos.map(aluno => 
        aluno.id === id ? { ...aluno, ...novosDados } : aluno
    );
};