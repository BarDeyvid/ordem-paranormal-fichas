const fs = require('fs');
const p = 'src/screens/Ficha/InventarioPanel.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/const creditosDisponiveis: LimiteCredito\[\] = \['Baixo', 'Medio', 'Alto', 'Ilimitado'\];/g, "const creditosDisponiveis: LimiteCredito[] = ['Baixo', 'Médio', 'Alto', 'Ilimitado'];");
fs.writeFileSync(p, c, 'utf8');
