const fs = require('fs');

let content = fs.readFileSync('src/utils/preRequisitos.ts', 'utf8');

// Replace the Regex for nexMatch
content = content.replace(
  /const nexMatch = textoLower\.match\(\/nex\\s\*\\(\\d\+\)%\/i\);/g,
  'const nexMatch = textoLower.match(/nex\\s*(\\d+)/i);'
);

// Replace the condition in case 3/4
const originalCode = `const nivelExigido = nexExigido === 99 ? 20 : Math.ceil(nexExigido / 5);
        if (contexto.nivel < nivelExigido) {
          return { atende: false, motivo: \`Nível \${nivelExigido}\` };
        }`;

const newCode = `const nivelExigido = nexExigido === 99 ? 20 : Math.ceil(nexExigido / 5);
        if (contexto.regras?.['nex_experiencia']) {
          if (contexto.nivel < nivelExigido) {
            return { atende: false, motivo: \`Nível \${nivelExigido}\` };
          }
        } else {
          if (contexto.nex < nexExigido) {
            return { atende: false, motivo: \`NEX \${nexExigido}%\` };
          }
        }`;

content = content.replace(originalCode, newCode);

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

// 5 -> 25
content = replaceLevelCheck(content, 5, 25);
// 6 -> 30
content = replaceLevelCheck(content, 6, 30);
// 8 -> 40
content = replaceLevelCheck(content, 8, 40);
// 9 -> 45
content = replaceLevelCheck(content, 9, 45);
// 10 -> 50
content = replaceLevelCheck(content, 10, 50);
// 12 -> 60
content = replaceLevelCheck(content, 12, 60);

// We need to run replaceLevelCheck multiple times since there are multiple instances of some levels.
for (let i = 0; i < 5; i++) {
  content = replaceLevelCheck(content, 5, 25);
  content = replaceLevelCheck(content, 6, 30);
  content = replaceLevelCheck(content, 8, 40);
  content = replaceLevelCheck(content, 9, 45);
  content = replaceLevelCheck(content, 10, 50);
  content = replaceLevelCheck(content, 12, 60);
}

fs.writeFileSync('src/utils/preRequisitos.ts', content);
