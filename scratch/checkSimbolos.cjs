const SUPABASE_URL = 'https://duoesappjstgejlwxkyp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b2VzYXBwanN0Z2VqbHd4a3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNTkwMzcsImV4cCI6MjA5ODYzNTAzN30.6r1GAxv420BfB1YgBmDzyyh4sBXYYIkVTSDhkqLuQ2w';

async function check() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY
  };
  
  const res = await fetch(SUPABASE_URL + '/rest/v1/S%C3%ADmbolos%20Rituais?select=*', { headers });
  if (!res.ok) {
    console.error('Failed to fetch:', await res.text());
  } else {
    const data = await res.json();
    console.log('Got', data.length, 'records');
    if (data.length > 0) {
      console.log('Sample:', data[1]);
    }
  }

  // What about Símbulos Rituais?
  const res2 = await fetch(SUPABASE_URL + '/rest/v1/S%C3%ADmbulos%20Rituais?select=*', { headers });
  if (!res2.ok) {
    console.error('Failed to fetch Símbulos:', await res2.text());
  } else {
    const data2 = await res2.json();
    console.log('Got', data2.length, 'records for Símbulos Rituais');
    if (data2.length > 0) {
      console.log('Sample:', data2[1]);
    }
  }
}
check().catch(console.error);
