import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWeapons() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const { data, error } = await supabase.from('Armas').select('*').eq('isAmaldicoada', true);
  if (error) {
    console.error(error);
  } else {
    data.filter(w => w.Tipo_Dano_Arma?.includes('Sangue') || w.Elemento_Arma === 'Sangue').forEach(w => console.log(w));
  }
}

checkWeapons();
