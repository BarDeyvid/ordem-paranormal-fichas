const fs = require('fs');
const file = 'src/screens/Ficha/index.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{renderAtributo('VIG', 'top-[78%] right-[28%] translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('VIG', 'top-[74%] right-[32%] translate-x-1/2 -translate-y-1/2')}"
);

content = content.replace(
  "{renderAtributo('PRE', 'top-[78%] left-[28%] -translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('PRE', 'top-[74%] left-[32%] -translate-x-1/2 -translate-y-1/2')}"
);

fs.writeFileSync(file, content);
console.log('Adjusted PRE and VIG positions');
