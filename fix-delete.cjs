const fs = require('fs');

let c = fs.readFileSync('src/hooks/useArmas.ts', 'utf8');

c = c.replace(
  /const removerArma = \(id: string\) => \{\s*setArmasInventario\(prev => prev\.filter\(item => item\.id !== id\)\);\s*\};/,
  `const removerArma = (id: string) => {
    setArmasInventario(prev => {
      const itemToDelete = prev.find(item => item.id === id);
      if (itemToDelete?.arma.Nome_Item?.includes('Dupla Obsessiva')) {
        const outroNome = itemToDelete.arma.Nome_Item === 'Dupla Obsessiva (Maça)' ? 'Dupla Obsessiva (Florete)' : 'Dupla Obsessiva (Maça)';
        // Acha o par que tem a flag isDuplaObsessivaLinked
        const outroItem = prev.find(item => item.arma.Nome_Item === outroNome && item.isDuplaObsessivaLinked);
        if (outroItem) {
          return prev.filter(item => item.id !== id && item.id !== outroItem.id);
        }
      }
      return prev.filter(item => item.id !== id);
    });
  };`
);

fs.writeFileSync('src/hooks/useArmas.ts', c);
