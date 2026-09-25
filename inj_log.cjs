const fs = require('fs');
let c = fs.readFileSync('src/hooks/useRituais.ts', 'utf8');
c = c.replace(/return urls\.default;/g, "console.log('getSimboloUrl:', codigo, elemento, urls); return urls.default;");
fs.writeFileSync('src/hooks/useRituais.ts', c);
