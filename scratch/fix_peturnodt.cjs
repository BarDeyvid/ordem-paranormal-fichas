const fs = require('fs');
const p = 'src/hooks/useStatus.ts';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /peTurno: number;\n  pdAtual: number;/g,
  "peTurno: number;\n  peTurnoDT: number;\n  pdAtual: number;"
);

c = c.replace(
  /const calcMaxPd = Math\.max\(0, calcularPD\(classe, atributos, nivel, regrasAtivas\) - paranormalPenalty\);/g,
  "const peTurnoDT = regrasAtivas?.has(6) ? peTurno - 1 : peTurno;\n\n  const calcMaxPd = Math.max(0, calcularPD(classe, atributos, nivel, regrasAtivas) - paranormalPenalty);"
);

c = c.replace(
  /peTurno,\n    hasPvTemp,/g,
  "peTurno,\n    peTurnoDT,\n    hasPvTemp,"
);

fs.writeFileSync(p, c, 'utf8');
