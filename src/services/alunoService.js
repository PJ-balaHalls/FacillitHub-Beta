// src/services/alunoService.js
import { supabase } from './supabaseClient';

/**
 * Busca todos os perfis de alunos do banco de dados.
 * @returns {Promise<Array>} Uma promessa que resolve para a lista de alunos.
 */
export const getAlunos = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_category', 'aluno');

    if (error) {
        console.error('Erro ao buscar alunos:', error);
        return [];
    }

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
        .single();

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
    const { error } = await supabase
        .from('profiles')
        .update(novosDados)
        .eq('id', id);

    if (error) {
        console.error('Erro ao atualizar aluno:', error);
    }
    
    return await getAlunos();
};


// <<< NOVA FUNÇÃO ADICIONADA AQUI >>>
/**
 * Atualiza o perfil de um usuário recém-cadastrado com dados adicionais.
 * @param {string} userId - O ID do usuário autenticado.
 * @param {Object} profileData - Os dados completos do perfil a serem inseridos.
 */
export const updateUserProfile = async (userId, profileData) => {
    const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);

    if (error) {
        console.error('Erro ao atualizar o perfil do usuário:', error);
        throw error;
    }
};