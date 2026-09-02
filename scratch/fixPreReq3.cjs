const fs = require('fs');
let content = fs.readFileSync('src/utils/preRequisitos.ts', 'utf8');

const map = {
  5: 25,
  6: 30,
  8: 40,
  9: 45,
  10: 50,
  12: 60
};

// Global replace with a regex to ensure it only replaces the simple check
for (const [level, nex] of Object.entries(map)) {
  const originalRegex = new RegExp(\`if \\\\(contexto\\\\.nivel < \${level}\\\\) return \\\\{ atende: false, motivo: 'Nível \${level}' \\\\};\`, 'g');
  const replacement = \`if (contexto.regras?.['nex_experiencia']) {
        if (contexto.nivel < \${level}) return { atende: false, motivo: 'Nível \${level}' };
      } else {
        if (contexto.nex < \${nex}) return { atende: false, motivo: 'NEX \${nex}%' };
      }\`;
  content = content.replace(originalRegex, replacement);
}

// And fix the dynamic case 18 and 20
const dynamicOriginal = \`const nivelMin = codigo === 18 ? 9 : 6;
      if (contexto.nivel < nivelMin) return { atende: false, motivo: \\\`Nível \\\${nivelMin}\\\` };\`;
const dynamicReplacement = \`const nivelMin = codigo === 18 ? 9 : 6;
      const nexMin = codigo === 18 ? 45 : 30;
      if (contexto.regras?.['nex_experiencia']) {
        if (contexto.nivel < nivelMin) return { atende: false, motivo: \\\`Nível \\\${nivelMin}\\\` };
      } else {
        if (contexto.nex < nexMin) return { atende: false, motivo: \\\`NEX \\\${nexMin}%\\\` };
      }\`;
content = content.replace(dynamicOriginal, dynamicReplacement);

fs.writeFileSync('src/utils/preRequisitos.ts', content);
