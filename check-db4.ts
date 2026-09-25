import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWeapons() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const { data, error } = await supabase.from('Armas Amaldiçoadas').select('*');
  if (error) {
    console.error(error);
  } else {
    data.filter(w => w.Nome_Item?.includes('Acha') || w.Elemento_Arma === 'Sangue' || w.Tipo_Dano_Arma?.includes('Sangue') || w.Dano_Arma?.includes('1d12') || w.Dano_Secundario?.includes('1d12')).forEach(w => console.log(w));
  }
}

checkWeapons();
