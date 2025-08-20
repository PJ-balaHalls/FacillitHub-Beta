import { dadosAlunos as initialData } from '../data/alunos';

const STORAGE_KEY = 'facillit_hub_alunos';

// Carrega os alunos do localStorage ou usa os dados iniciais
export const getAlunos = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    } else {
        // Se for a primeira vez, salva os dados iniciais no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData;
    }
};

// Salva a lista completa de alunos no localStorage
export const salvarAlunos = (alunos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alunos));
};

// Atualiza um único aluno na lista e salva
export const atualizarAluno = (id, novosDados) => {
    let alunos = getAlunos();
    alunos = alunos.map(aluno =>
        aluno.id === id ? { ...aluno, ...novosDados } : aluno
    );
    salvarAlunos(alunos);
    return alunos; // Retorna a lista atualizada
};