const fs = require('fs');
let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

if (!content.includes('import { calcularNivel } from')) {
  content = content.replace(
    `import { verificarAcessoCirculo } from '../utils/rpgRules';`,
    `import { verificarAcessoCirculo, calcularNivel } from '../utils/rpgRules';`
  );
  // Just in case it's in the same line as obterValorVersao
  content = content.replace(
    `import { obterValorVersao, verificarAcessoCirculo } from '../utils/rpgRules';`,
    `import { obterValorVersao, verificarAcessoCirculo, calcularNivel } from '../utils/rpgRules';`
  );
}

fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
console.log('Fixed imports');
