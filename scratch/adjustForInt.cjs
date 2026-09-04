const fs = require('fs');
const file = 'src/screens/Ficha/index.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{renderAtributo('INT', 'top-[39%] right-[15%] translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('INT', 'top-[36%] right-[19%] translate-x-1/2 -translate-y-1/2')}"
);

content = content.replace(
  "{renderAtributo('FOR', 'top-[39%] left-[15%] -translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('FOR', 'top-[36%] left-[19%] -translate-x-1/2 -translate-y-1/2')}"
);

fs.writeFileSync(file, content);
console.log('Adjusted FOR and INT positions');
