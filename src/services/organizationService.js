// src/services/organizationService.js
import { supabase } from './supabaseClient';
import { nanoid } from 'nanoid';

export const getMinhaOrganizacao = async (userId) => {
    const { data, error } = await supabase
        .from('organization_members')
        .select(`organizations (*)`)
        .eq('user_id', userId)
        .limit(1)
        .single();
    
    if (error) {
        console.error("Erro ao buscar organização:", error);
        return null;
    }
    return data ? data.organizations : null;
};

// <<< FUNÇÃO ATUALIZADA >>>
/**
 * Cria um novo código de convite com dados de pré-cadastro.
 * @param {string} organizationId - O ID da organização.
 * @param {Object} prefilledData - Objeto com os dados do aluno (full_name, email, birth_date).
 * @returns {Promise<Object|null>} O novo código de convite.
 */
export const criarCodigoConvite = async (organizationId, prefilledData) => {
    const codigo = nanoid(8).toUpperCase();

    const { data, error } = await supabase
        .from('invitation_codes')
        .insert({
            code: codigo,
            organization_id: organizationId,
            role: 'student',
            prefilled_data: prefilledData, // Armazena os dados do aluno
        })
        .select()
        .single();
    
    if (error) {
        console.error("Erro ao criar código:", error);
        return null;
    }
    return data;
};

export const validateInvitationCode = async (code) => {
    const { data, error } = await supabase
        .from('invitation_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .is('used_by_user_id', null)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Erro ao validar código:', error);
    }
    return data || null;
};

export const linkUserToOrganization = async (userId, organizationId, role) => {
    const { error } = await supabase
        .from('organization_members')
        .insert({ user_id: userId, organization_id: organizationId, role: role });

    if (error) throw error;
};

export const markCodeAsUsed = async (codeId, userId) => {
    const { error } = await supabase
        .from('invitation_codes')
        .update({ used_by_user_id: userId, used_at: new Date() })
        .eq('id', codeId);

    if (error) throw error;
};