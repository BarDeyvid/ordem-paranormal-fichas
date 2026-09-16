const fs = require('fs');

let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

const search = `                      {(() => {
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
                      })()}`;

const replace = `                      {(() => {
                        const elementoStrOriginal = base.Elemento_Ritual === 'Varia' || base.Elemento_Ritual === 'Lista' ? (ritualA.elemento_escolhido || 'Sangue') : base.Elemento_Ritual;
                        const elStr = String(elementoStrOriginal).toLowerCase();
                        const corText = elStr.includes('medo') ? 'bg-zinc-200/80 text-zinc-950 px-1' :
                                        elStr.includes('sangue') ? 'text-red-500' :
                                        elStr.includes('morte') ? 'bg-black/50 text-white px-1' :
                                        elStr.includes('conhecimento') ? 'text-yellow-500' :
                                        elStr.includes('energia') ? 'text-purple-500' : 
                                        'text-zinc-400';
                        return (
                          <span className={\`text-[10px] font-bold rounded-sm truncate uppercase tracking-wider w-fit \${corText}\`}>
                            {elementoStrOriginal}
                          </span>
                        );
                      })()}`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Fixed element formatting');
} else {
  console.log('Not found');
}
