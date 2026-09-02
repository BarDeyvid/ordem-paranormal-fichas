const SUPABASE_URL = 'https://duoesappjstgejlwxkyp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b2VzYXBwanN0Z2VqbHd4a3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNTkwMzcsImV4cCI6MjA5ODYzNTAzN30.6r1GAxv420BfB1YgBmDzyyh4sBXYYIkVTSDhkqLuQ2w';

async function check() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY
  };
  
  const res1 = await fetch(SUPABASE_URL + '/rest/v1/Poderes?select=*', { headers });
  const poderes = await res1.json();
  
  console.log('--- PODERES ---');
  let firstPoderWithAuto = poderes.find(p => p.Automatico || p['Automatico?']);
  if (firstPoderWithAuto) {
    console.log(firstPoderWithAuto);
  } else {
    // maybe keys are different?
    if (poderes.length > 0) {
      console.log('Keys in Poderes:', Object.keys(poderes[0]));
    }
  }

  const res2 = await fetch(SUPABASE_URL + '/rest/v1/PoderesParanormais?select=*', { headers });
  const pp = await res2.json();
  
  console.log('--- PODERES PARANORMAIS ---');
  let firstPPWithAuto = pp.find(p => p.Automatico || p['Automatico?'] || p['Automatico?_Afinidade']);
  if (firstPPWithAuto) {
    console.log(firstPPWithAuto);
  } else {
    if (pp.length > 0) {
      console.log('Keys in PoderesParanormais:', Object.keys(pp[0]));
    }
  }
}
check().catch(console.error);
