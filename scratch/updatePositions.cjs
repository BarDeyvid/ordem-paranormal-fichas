const fs = require('fs');

let content = fs.readFileSync('src/screens/Ficha/index.tsx', 'utf8');

content = content.replace(
  "{renderAtributo('AGI', 'top-[12%] left-[50%] -translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('AGI', 'top-[16%] left-[50%] -translate-x-1/2 -translate-y-1/2')}"
);
content = content.replace(
  "{renderAtributo('INT', 'top-[39%] right-[11%] translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('INT', 'top-[39%] right-[15%] translate-x-1/2 -translate-y-1/2')}"
);
content = content.replace(
  "{renderAtributo('VIG', 'top-[82%] right-[24%] translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('VIG', 'top-[78%] right-[28%] translate-x-1/2 -translate-y-1/2')}"
);
content = content.replace(
  "{renderAtributo('PRE', 'top-[82%] left-[24%] -translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('PRE', 'top-[78%] left-[28%] -translate-x-1/2 -translate-y-1/2')}"
);
content = content.replace(
  "{renderAtributo('FOR', 'top-[39%] left-[11%] -translate-x-1/2 -translate-y-1/2')}",
  "{renderAtributo('FOR', 'top-[39%] left-[15%] -translate-x-1/2 -translate-y-1/2')}"
);

fs.writeFileSync('src/screens/Ficha/index.tsx', content);
console.log('Replaced positions');
