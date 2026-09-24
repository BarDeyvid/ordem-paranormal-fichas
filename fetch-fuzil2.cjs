process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const URL = "https://duoesappjstgejlwxkyp.supabase.co/rest/v1/Armas?select=Nome_Item";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b2VzYXBwanN0Z2VqbHd4a3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNTkwMzcsImV4cCI6MjA5ODYzNTAzN30.6r1GAxv420BfB1YgBmDzyyh4sBXYYIkVTSDhkqLuQ2w";

fetch("https://duoesappjstgejlwxkyp.supabase.co/rest/v1/Armas%20Amaldi%C3%A7oadas?select=Nome_Item,Especial_Arma,Dano_Arma", {
  headers: { "apikey": KEY, "Authorization": "Bearer " + KEY }
})
.then(res => res.json())
.then(data => {
  data.forEach(a => {
    if (a.Nome_Item.toLowerCase().includes('fuzil')) {
      console.log(a.Nome_Item, a.Especial_Arma, a.Dano_Arma);
    }
  });
});
