// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Busca as variáveis de ambiente que configuramos
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Cria e exporta o cliente Supabase para ser usado em qualquer parte do projeto
export const supabase = createClient(supabaseUrl, supabaseAnonKey);