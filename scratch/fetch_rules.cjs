const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchRules() {
  const { data, error } = await supabase
    .from('Regras Poderes')
    .select('*')
    .order('Codigo_Regra', { ascending: true });
    
  if (error) {
    console.error(error);
  } else {
    fs.writeFileSync('scratch/regras_poderes.json', JSON.stringify(data, null, 2), 'utf8');
  }
}

fetchRules();
