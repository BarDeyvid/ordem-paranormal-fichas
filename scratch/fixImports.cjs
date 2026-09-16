const fs = require('fs');
let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

// Add import if missing
if (!content.includes('verificarAcessoCirculo')) {
  content = `import { verificarAcessoCirculo, calcularNivel } from '../utils/rpgRules';\n` + content;
}

// Make sure formatarDescricao is properly defined as I added it
// Let's check if the previous script's `fixHeaders.cjs` worked. It probably failed because `obterValorVersao` wasn't an import.
// I will just add `verificarAcessoCirculo` manually if it's missing.

fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
console.log('Fixed imports');
