const fs = require('fs');
let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

const search = `                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-zinc-100">{ritualA.customNome || base.Nome_Ritual}</h4>
                    </div>`;

const replace = `                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-[15px] text-zinc-100">{ritualA.customNome || base.Nome_Ritual}</h4>
                      {(() => {
                        const elementoStr = (base.Elemento_Ritual === 'Varia' || base.Elemento_Ritual === 'Lista' ? (ritualA.elemento_escolhido || 'Sangue') : base.Elemento_Ritual).toLowerCase();
                        let badgeClass = 'border-zinc-700 bg-zinc-800 text-zinc-300';
                        if (elementoStr === 'morte') badgeClass = 'border-zinc-700 bg-black/50 text-white';
                        else if (elementoStr === 'medo') badgeClass = 'border-zinc-500 bg-zinc-200/80 text-zinc-950';
                        else if (elementoStr === 'sangue') badgeClass = 'border-red-900 bg-red-950/20 text-red-500';
                        else if (elementoStr === 'energia') badgeClass = 'border-purple-900 bg-purple-950/20 text-purple-500';
                        else if (elementoStr === 'conhecimento') badgeClass = 'border-yellow-900 bg-yellow-950/20 text-yellow-500';
                        
                        return (
                          <div className={\`text-[9px] uppercase font-bold px-1.5 py-0.5 border rounded-sm tracking-widest \${badgeClass}\`}>
                            {elementoStr}
                          </div>
                        );
                      })()}
                    </div>`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Fixed element badge');
} else {
  console.log('Not found');
}
