const fs = require('fs');
const file = 'src/screens/Ficha/index.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{renderAtributo('VIG', 'top-[76%] right-[30%] translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('VIG', 'top-[72%] right-[27%] translate-x-1/2 -translate-y-1/2')}"
);

content = content.replace(
  "{renderAtributo('PRE', 'top-[76%] left-[30%] -translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('PRE', 'top-[72%] left-[27%] -translate-x-1/2 -translate-y-1/2')}"
);

fs.writeFileSync(file, content);
console.log('Adjusted PRE and VIG positions: higher and more outward');
