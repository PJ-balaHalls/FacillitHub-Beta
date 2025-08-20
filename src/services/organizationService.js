// src/services/organizationService.js
import { supabase } from './supabaseClient';
import { nanoid } from 'nanoid';

/**
 * Busca a primeira organização à qual um usuário (professor/gestor) pertence.
 * @param {string} userId - O ID do usuário.
 * @returns {Promise<Object|null>} A organização do usuário.
 */
export const getMinhaOrganizacao = async (userId) => {
    const { data, error } = await supabase
        .from('organization_members')
        .select(`
            organizations (*)
        `)
        .eq('user_id', userId)
        .limit(1)
        .single();
    
    if (error) {
        console.error("Erro ao buscar organização:", error);
        return null;
    }

    return data ? data.organizations : null;
};

/**
 * Cria um novo código de convite para uma organização.
 * @param {string} organizationId - O ID da organização.
 * @param {string} createdByUserId - O ID do usuário que está criando o código.
 * @returns {Promise<Object|null>} O novo código de convite.
 */
export const criarCodigoConvite = async (organizationId, createdByUserId) => {
    const codigo = nanoid(8).toUpperCase();

    const { data, error } = await supabase
        .from('invitation_codes')
        .insert({
            code: codigo,
            organization_id: organizationId,
            role: 'student',
            created_by: createdByUserId,
        })
        .select()
        .single();
    
    if (error) {
        console.error("Erro ao criar código:", error);
        return null;
    }

    return data;
};

// <<< NOVAS FUNÇÕES ADICIONADAS AQUI >>>

/**
 * Valida um código de convite.
 * @param {string} code - O código a ser validado.
 * @returns {Promise<Object|null>} Os dados do código se for válido, senão null.
 */
export const validateInvitationCode = async (code) => {
    const { data, error } = await supabase
        .from('invitation_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .is('used_by_user_id', null) // Garante que o código não foi usado
        .single();

    if (error) {
        // "PGRST116" é o código de erro do Supabase para "nenhuma linha encontrada", o que é normal.
        if (error.code !== 'PGRST116') {
            console.error('Erro ao validar código:', error);
        }
        return null;
    }
    return data;
};

/**
 * Vincula um usuário a uma organização na tabela de membros.
 * @param {string} userId - O ID do usuário.
 * @param {string} organizationId - O ID da organização.
 * @param {string} role - O papel do usuário na organização.
 */
export const linkUserToOrganization = async (userId, organizationId, role) => {
    const { error } = await supabase
        .from('organization_members')
        .insert({
            user_id: userId,
            organization_id: organizationId,
            role: role,
        });

    if (error) {
        console.error('Erro ao vincular usuário à organização:', error);
        throw error;
    }
};

/**
 * Marca um código de convite como utilizado.
 * @param {string} codeId - O ID do código.
 * @param {string} userId - O ID do usuário que utilizou o código.
 */
export const markCodeAsUsed = async (codeId, userId) => {
    const { error } = await supabase
        .from('invitation_codes')
        .update({ used_by_user_id: userId, used_at: new Date() })
        .eq('id', codeId);

    if (error) {
        console.error('Erro ao marcar código como usado:', error);
        throw error;
    }
};