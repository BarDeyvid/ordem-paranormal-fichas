const fs = require('fs');
let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');

const searchIdx2 = content.indexOf('rituaisAprendidosNesteCirculoFiltrados.forEach(ritual => {');
console.log(content.substring(searchIdx2, searchIdx2 + 2000));
