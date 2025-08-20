// src/services/alunoService.js
import { supabase } from './supabaseClient';

/**
 * Busca todos os perfis de alunos do banco de dados.
 * @returns {Promise<Array>} Uma promessa que resolve para a lista de alunos.
 */
export const getAlunos = async () => {
    // Usamos o 'select' para buscar todos os dados (*) da tabela 'profiles'
    // Onde a categoria do usuário é 'aluno'
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_category', 'aluno');

    if (error) {
        console.error('Erro ao buscar alunos:', error);
        return [];
    }

    // O Supabase retorna os dados no formato que já usamos, então poucas mudanças são necessárias.
    // Apenas garantimos que os dados que podem não existir (notas, frequencia) sejam arrays ou objetos vazios.
    return data.map(aluno => ({
        ...aluno,
        notas: aluno.notas || { b1: [], b2: [], b3: [], b4: [] },
        frequencia: aluno.frequencia || {},
    }));
};

/**
 * Busca um único aluno pelo seu ID.
 * @param {string} id - O UUID do aluno.
 * @returns {Promise<Object|null>} Uma promessa que resolve para o objeto do aluno ou null se não for encontrado.
 */
export const getAlunoById = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single(); // .single() retorna um único objeto em vez de um array

    if (error) {
        console.error('Erro ao buscar aluno por ID:', error);
        return null;
    }
    
    return data ? {
        ...data,
        notas: data.notas || { b1: [], b2: [], b3: [], b4: [] },
        frequencia: data.frequencia || {},
    } : null;
};


/**
 * Atualiza os dados de um aluno específico no banco.
 * @param {string} id - O UUID do aluno a ser atualizado.
 * @param {Object} novosDados - Um objeto com os campos a serem atualizados (ex: { notas: novoObjetoDeNotas }).
 * @returns {Promise<Array>} Uma promessa que resolve para a lista de alunos atualizada.
 */
export const atualizarAluno = async (id, novosDados) => {
    // Usamos 'update' para modificar a linha onde o 'id' corresponde
    const { error } = await supabase
        .from('profiles')
        .update(novosDados)
        .eq('id', id);

    if (error) {
        console.error('Erro ao atualizar aluno:', error);
    }
    
    // Após atualizar, buscamos a lista completa novamente para garantir que a UI esteja sincronizada.
    return await getAlunos();
};