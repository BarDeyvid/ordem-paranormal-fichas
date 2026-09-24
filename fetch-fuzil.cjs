process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const URL = "https://duoesappjstgejlwxkyp.supabase.co/rest/v1/Armas?select=*";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b2VzYXBwanN0Z2VqbHd4a3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNTkwMzcsImV4cCI6MjA5ODYzNTAzN30.6r1GAxv420BfB1YgBmDzyyh4sBXYYIkVTSDhkqLuQ2w";

fetch(URL, {
  headers: {
    "apikey": KEY,
    "Authorization": "Bearer " + KEY
  }
})
.then(res => res.json())
.then(data => {
  const fuzil = data.find(a => a.Nome_Item === 'Fuzil Alheio');
  if (fuzil) {
    console.log("ESPECIAL:", fuzil.Especial_Arma);
    console.log("DANO:", fuzil.Dano_Arma);
  } else {
    console.log("Not found in Armas, checking Armas Amaldicoadas...");
    fetch("https://duoesappjstgejlwxkyp.supabase.co/rest/v1/Armas%20Amaldi%C3%A7oadas?select=*", {
      headers: { "apikey": KEY, "Authorization": "Bearer " + KEY }
    })
    .then(res => res.json())
    .then(data2 => {
      const fuzil2 = data2.find(a => a.Nome_Item === 'Fuzil Alheio');
      if (fuzil2) {
        console.log("ESPECIAL AMA:", fuzil2.Especial_Arma);
        console.log("DANO AMA:", fuzil2.Dano_Arma);
      } else {
        console.log("Not found in cursed either");
      }
    });
  }
});
