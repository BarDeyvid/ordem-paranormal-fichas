import { createClient } from '@supabase/supabase-js';
import { apiClient } from './api';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se as credenciais do Supabase estiverem configuradas, usa o cliente Supabase.
// Caso contrário, usa transparentemente o backend FastAPI local.
export const supabase: any = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : apiClient;

export default supabase;
