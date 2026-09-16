const fs = require('fs');

let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

const search = `const ritual = rituaisHook.rituaisAprendidos.find(r => \`\${r.Codigo_Ritual}_\${r.Origem}\` === val);
                    if (ritual) {
                      const circulosMap: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
                      itensAmaldicoadosHook.editarItem(item.id, { 
                        ritualSeloKey: val,
                        Categoria_Ama: circulosMap[ritual.Circulo_Ritual] || 'Varia',
                        Elemento_Ama: ritual.Elemento_Ritual === 'Varia' || ritual.Elemento_Ritual === 'Lista' ? (ritual.ElementoEscolhidoPermanente || 'Sangue') : ritual.Elemento_Ritual
                      });
                    }`;

const replace = `const ritualA = rituaisHook.rituaisAprendidos.find(r => \`\${r.codigo_ritual}_\${r.origem}\` === val);
                    if (ritualA) {
                      const base = rituaisHook.rituais.find(b => b.Codigo_Ritual === ritualA.codigo_ritual);
                      if (base) {
                        const circulosMap: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
                        itensAmaldicoadosHook.editarItem(item.id, { 
                          ritualSeloKey: val,
                          Categoria_Ama: circulosMap[base.Circulo_Ritual] || 'Varia',
                          Elemento_Ama: base.Elemento_Ritual === 'Varia' || base.Elemento_Ritual === 'Lista' ? (ritualA.elemento_escolhido || 'Sangue') : base.Elemento_Ritual
                        });
                      }
                    }`;

const idx = content.indexOf('const ritual = rituaisHook.rituaisAprendidos.find(r => `${r.Codigo_Ritual}_${r.Origem}` === val);');
if (idx !== -1) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Fixed onChange');
} else {
  console.log('Not found');
}
