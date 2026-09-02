const fs = require('fs');
let file = 'src/hooks/useRituais.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/Smbolos Rituais/g, 'Símbolos Rituais');
content = content.replace(/Símbolos Rituais/g, 'Símbolos Rituais'); // just in case
fs.writeFileSync(file, content);
console.log('Fixed encoding in useRituais.ts');
