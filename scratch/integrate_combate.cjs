const fs = require('fs');

let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');

content = content.replace(
  "import { InventarioPanel } from './InventarioPanel';",
  "import { InventarioPanel } from './InventarioPanel';\nimport { CombatePanel } from './CombatePanel';"
);

content = content.replace(
  "{abaDireita === 'combate' && <div className=\"mt-5 text-center italic text-zinc-600\">Conteúdo de Combate</div>}",
  "{abaDireita === 'combate' && <CombatePanel />}"
);

fs.writeFileSync('src/screens/Ficha/AbasPanel.tsx', content, 'utf8');
