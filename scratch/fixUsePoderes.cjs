const fs = require('fs');

let content = fs.readFileSync('src/hooks/usePoderes.ts', 'utf8');

// In normalizarPoder
content = content.replace(
  "Pericia_Poder: primeiro('Pericia_Poder', 'pericia_poder') ? Number(primeiro('Pericia_Poder', 'pericia_poder')) : null,",
  "Pericia_Poder: primeiro('Pericia_Poder', 'pericia_poder') ? Number(primeiro('Pericia_Poder', 'pericia_poder')) : null,\n    Automatico: (primeiro('Automatico', 'automatico') as string) || null,"
);

// In normalizarPoderParanormal
content = content.replace(
  "Pericia_Poder: primeiro('Pericia_Poder_Paranormal', 'pericia_poder_paranormal', 'Pericia_Poder', 'pericia_poder')\n      ? Number(primeiro('Pericia_Poder_Paranormal', 'pericia_poder_paranormal', 'Pericia_Poder', 'pericia_poder'))\n      : null,",
  "Pericia_Poder: primeiro('Pericia_Poder_Paranormal', 'pericia_poder_paranormal', 'Pericia_Poder', 'pericia_poder')\n      ? Number(primeiro('Pericia_Poder_Paranormal', 'pericia_poder_paranormal', 'Pericia_Poder', 'pericia_poder'))\n      : null,\n    'Automatico?': (primeiro('Automatico?', 'automatico?') as string) || null,\n    'Automatico?_Afinidade': (primeiro('Automatico?_Afinidade', 'automatico?_afinidade') as string) || null,"
);

fs.writeFileSync('src/hooks/usePoderes.ts', content);
