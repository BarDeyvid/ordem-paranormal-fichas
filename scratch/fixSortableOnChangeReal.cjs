const fs = require('fs');

let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

// The exact string to replace is inside the onChange. We'll use regex or replace between known safe boundaries.
const startMarker = `onChange={(val) => {`;
const endMarker = `options={[`;

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const newOnChange = `onChange={(val) => {
                    if (!val) {
                      itensAmaldicoadosHook.editarItem(item.id, { ritualSeloKey: undefined, Categoria_Ama: 'Varia', Elemento_Ama: 'Varia' });
                      return;
                    }
                    const ritualA = rituaisHook.rituaisAprendidos.find(r => \`\${r.codigo_ritual}_\${r.origem}\` === val);
                    if (ritualA) {
                      const base = rituaisHook.rituais.find(b => b.Codigo_Ritual == ritualA.codigo_ritual);
                      if (base) {
                        const circulosMap: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
                        itensAmaldicoadosHook.editarItem(item.id, { 
                          ritualSeloKey: val,
                          Categoria_Ama: circulosMap[base.Circulo_Ritual] || 'Varia',
                          Elemento_Ama: base.Elemento_Ritual === 'Varia' || base.Elemento_Ritual === 'Lista' ? (ritualA.elemento_escolhido || 'Sangue') : base.Elemento_Ritual
                        });
                      }
                    }
                  }}
                  `;
                  
  content = content.substring(0, startIdx) + newOnChange + content.substring(endIdx);
  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Fixed onChange FOR REAL THIS TIME');
} else {
  console.log('Markers not found');
}
