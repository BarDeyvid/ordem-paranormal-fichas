const fs = require('fs');

const file = 'src/screens/Ficha/AbasPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/hab\.automatico === 'Sim'/g, "hab.automatico.toLowerCase().trim() === 'sim'");

fs.writeFileSync(file, content);
