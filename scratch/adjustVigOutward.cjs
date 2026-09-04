const fs = require('fs');
const file = 'src/screens/Ficha/index.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{renderAtributo('VIG', 'top-[74%] right-[29%] translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('VIG', 'top-[74%] right-[28%] translate-x-1/2 -translate-y-1/2')}"
);

fs.writeFileSync(file, content);
console.log('Adjusted VIG position slightly outward to 28%');
