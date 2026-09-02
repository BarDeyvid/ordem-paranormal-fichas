const fs = require('fs');

let content = fs.readFileSync('src/hooks/usePoderes.ts', 'utf8');

const regex = /Pericia_Poder: primeiro\('Pericia_Poder_Paranormal', 'pericia_poder_paranormal', 'Pericia_Poder', 'pericia_poder'\)\r?\n      \? Number\(primeiro\('Pericia_Poder_Paranormal', 'pericia_poder_paranormal', 'Pericia_Poder', 'pericia_poder'\)\)\r?\n      : null,/;

const replacement = `Pericia_Poder: primeiro('Pericia_Poder_Paranormal', 'pericia_poder_paranormal', 'Pericia_Poder', 'pericia_poder')
      ? Number(primeiro('Pericia_Poder_Paranormal', 'pericia_poder_paranormal', 'Pericia_Poder', 'pericia_poder'))
      : null,
    'Automatico?': (primeiro('Automatico?', 'automatico?') as string) || null,
    'Automatico?_Afinidade': (primeiro('Automatico?_Afinidade', 'automatico?_afinidade') as string) || null,`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/hooks/usePoderes.ts', content);
