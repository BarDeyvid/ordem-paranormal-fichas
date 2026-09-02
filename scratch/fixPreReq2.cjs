const fs = require('fs');

let content = fs.readFileSync('src/utils/preRequisitos.ts', 'utf8');

// Function to replace other instances of `contexto.nivel < X`
function replaceLevelCheck(content, level, nex) {
  const original = `if (contexto.nivel < ${level}) return { atende: false, motivo: 'Nível ${level}' };`;
  const replacement = `if (contexto.regras?.['nex_experiencia']) {
        if (contexto.nivel < ${level}) return { atende: false, motivo: 'Nível ${level}' };
      } else {
        if (contexto.nex < ${nex}) return { atende: false, motivo: 'NEX ${nex}%' };
      }`;
  return content.replace(original, replacement);
}

// Map of levels to NEX
const map = {
  5: 25,
  6: 30,
  8: 40,
  9: 45,
  10: 50,
  12: 60
};

// We need to run replaceLevelCheck multiple times since there are multiple instances of some levels.
for (let i = 0; i < 5; i++) {
  for (const [level, nex] of Object.entries(map)) {
    content = replaceLevelCheck(content, level, nex);
  }
}

// And fix the dynamic case 18 and 20
const dynamicOriginal = `const nivelMin = codigo === 18 ? 9 : 6;
      if (contexto.nivel < nivelMin) return { atende: false, motivo: \`Nível \${nivelMin}\` };`;
const dynamicReplacement = `const nivelMin = codigo === 18 ? 9 : 6;
      const nexMin = codigo === 18 ? 45 : 30;
      if (contexto.regras?.['nex_experiencia']) {
        if (contexto.nivel < nivelMin) return { atende: false, motivo: \`Nível \${nivelMin}\` };
      } else {
        if (contexto.nex < nexMin) return { atende: false, motivo: \`NEX \${nexMin}%\` };
      }`;
content = content.replace(dynamicOriginal, dynamicReplacement);

fs.writeFileSync('src/utils/preRequisitos.ts', content);
