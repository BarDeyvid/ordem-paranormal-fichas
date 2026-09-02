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
  const originalStr = "if (contexto.nivel < " + level + ") return { atende: false, motivo: 'Nível " + level + "' };";
  const replacement = "if (contexto.regras?.['nex_experiencia']) {\n        if (contexto.nivel < " + level + ") return { atende: false, motivo: 'Nível " + level + "' };\n      } else {\n        if (contexto.nex < " + nex + ") return { atende: false, motivo: 'NEX " + nex + "%' };\n      }";
  
  // Use string replace instead of regex for safety, replace all occurrences manually
  while (content.includes(originalStr)) {
    content = content.replace(originalStr, replacement);
  }
}

// And fix the dynamic case 18 and 20
const dynamicOriginal = "const nivelMin = codigo === 18 ? 9 : 6;\n      if (contexto.nivel < nivelMin) return { atende: false, motivo: `Nível ${nivelMin}` };";
const dynamicReplacement = "const nivelMin = codigo === 18 ? 9 : 6;\n      const nexMin = codigo === 18 ? 45 : 30;\n      if (contexto.regras?.['nex_experiencia']) {\n        if (contexto.nivel < nivelMin) return { atende: false, motivo: `Nível ${nivelMin}` };\n      } else {\n        if (contexto.nex < nexMin) return { atende: false, motivo: `NEX ${nexMin}%` };\n      }";
content = content.replace(dynamicOriginal, dynamicReplacement);

fs.writeFileSync('src/utils/preRequisitos.ts', content);
