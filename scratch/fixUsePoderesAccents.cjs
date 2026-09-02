const fs = require('fs');

let content = fs.readFileSync('src/hooks/usePoderes.ts', 'utf8');

const regex1 = /Automatico: \(primeiro\('Automatico\?', 'automatico\?', 'Automatico', 'automatico'\) as string\) \|\| null,/;
const rep1 = `Automatico: (primeiro('Automatico?', 'automatico?', 'Automatico', 'automatico', 'Automático', 'automático', 'Automático?', 'automático?') as string) || null,`;
content = content.replace(regex1, rep1);

const regex2 = /'Automatico\?': \(primeiro\('Automatico\?', 'automatico\?'\) as string\) \|\| null,/;
const rep2 = `'Automatico?': (primeiro('Automatico?', 'automatico?', 'Automático?', 'automático?', 'Automatico', 'automatico') as string) || null,`;
content = content.replace(regex2, rep2);

const regex3 = /'Automatico\?_Afinidade': \(primeiro\('Automatico\?_Afinidade', 'automatico\?_afinidade'\) as string\) \|\| null,/;
const rep3 = `'Automatico?_Afinidade': (primeiro('Automatico?_Afinidade', 'automatico?_afinidade', 'Automático?_Afinidade', 'automático?_afinidade') as string) || null,`;
content = content.replace(regex3, rep3);

fs.writeFileSync('src/hooks/usePoderes.ts', content);
