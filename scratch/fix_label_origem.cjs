const fs = require('fs');
const p = 'src/screens/Ficha/AbasPanel.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /const labelNex = isOrigemSlot \? 'Poder da Origem'/g,
  "const labelNex = isOrigemSlot ? 'Origem'"
);

fs.writeFileSync(p, c, 'utf8');
