const fs = require('fs');

let content = fs.readFileSync('src/hooks/usePoderes.ts', 'utf8');

const regex = /Automatico: \(primeiro\('Automatico', 'automatico'\) as string\) \|\| null,/;
const replacement = `Automatico: (primeiro('Automatico?', 'automatico?', 'Automatico', 'automatico') as string) || null,`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/hooks/usePoderes.ts', content);
