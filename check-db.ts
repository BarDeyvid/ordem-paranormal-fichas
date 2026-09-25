import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWeapons() {
  const { data, error } = await supabase.from('Armas').select('Nome_Item, Dano_Arma, Dano_Secundario, Tipo_Dano_Arma, Elemento_Arma').eq('isAmaldicoada', true);
  if (error) {
    console.error(error);
  } else {
    console.log(data.filter(w => w.Tipo_Dano_Arma?.includes('Sangue') || w.Elemento_Arma === 'Sangue'));
  }
}

checkWeapons();
