const fs = require('fs');

let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

if (!content.includes('const [ritualExpandido, setRitualExpandido] = useState(false);')) {
  // Add state to SortableItemAmaldicoado
  const stateSearch = `export function SortableItemAmaldicoado({ item, isExpanded, toggleExpandir, removerItem, stringDT, onEditar, toggleEquipado, isOverlay }: SortableItemAmaldicoadoProps) {
  const { classe, nex } = useRPG();
  const nivel = calcularNivel(nex);
  const { modificacoesHook, rituaisHook, itensAmaldicoadosHook, versaoRitual, setVersaoRitual } = useRPG();`;

  const stateReplace = `export function SortableItemAmaldicoado({ item, isExpanded, toggleExpandir, removerItem, stringDT, onEditar, toggleEquipado, isOverlay }: SortableItemAmaldicoadoProps) {
  const { classe, nex } = useRPG();
  const nivel = calcularNivel(nex);
  const { modificacoesHook, rituaisHook, itensAmaldicoadosHook, versaoRitual, setVersaoRitual } = useRPG();
  const [ritualExpandido, setRitualExpandido] = useState(false);`;

  content = content.replace(stateSearch, stateReplace);

  // Wrap the ritual details in a Collapse, make the header clickable
  // The header:
  const blockSearch = `                return (
                  <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-[15px] text-zinc-100">{ritualA.customNome || base.Nome_Ritual}</h4>
                      {(() => {
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
                      })()}
                    </div>
                    <div className="flex justify-between items-center bg-zinc-900 rounded p-1.5 border border-zinc-800">
                       <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider ml-1">Custo: <span className="text-zinc-300">{pe}</span></span>
                       {optionsVersao.length > 1 && (
                         <CustomSelect
                           value={versao}
                           onChange={(v) => setVersaoRitual(prev => ({...prev, [item.item.ritualSeloKey as string]: v as any}))}
                           options={optionsVersao}
                           hideIcon
                           wrapperClassName="!min-w-[100px]"
                           className="text-[10px] py-1 min-h-0 bg-transparent border-none text-zinc-400 font-bold uppercase tracking-wider text-right cursor-pointer hover:text-green-400 focus:text-green-400"
                         />
                       )}
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">`;

  const blockReplace = `                return (
                  <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-zinc-800/50">
                    <div 
                      className="flex items-center gap-2 mb-1 cursor-pointer select-none group"
                      onClick={() => setRitualExpandido(!ritualExpandido)}
                    >
                      <h4 className="font-bold text-[15px] text-zinc-100 group-hover:text-green-400 transition-colors">{ritualA.customNome || base.Nome_Ritual}</h4>
                      {(() => {
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
                      })()}
                      <span className="ml-auto text-zinc-500 text-xs">
                        {ritualExpandido ? '▼' : '▶'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-zinc-900 rounded p-1.5 border border-zinc-800">
                       <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider ml-1">Custo: <span className="text-zinc-300">{pe}</span></span>
                       {optionsVersao.length > 1 && (
                         <CustomSelect
                           value={versao}
                           onChange={(v) => setVersaoRitual(prev => ({...prev, [item.item.ritualSeloKey as string]: v as any}))}
                           options={optionsVersao}
                           hideIcon
                           wrapperClassName="!min-w-[100px]"
                           className="text-[10px] py-1 min-h-0 bg-transparent border-none text-zinc-400 font-bold uppercase tracking-wider text-right cursor-pointer hover:text-green-400 focus:text-green-400"
                         />
                       )}
                    </div>

                    <Collapse isOpen={ritualExpandido}>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">`;

  content = content.replace(blockSearch, blockReplace);

  // Close the Collapse wrapper
  const closeSearch = `                          );
                        });
                      })()}
                    </div>
                  </div>
                );
              })()}`;

  const closeReplace = `                          );
                        });
                      })()}
                    </div>
                      </div>
                    </Collapse>
                  </div>
                );
              })()}`;

  content = content.replace(closeSearch, closeReplace);
  
  // Need to import Collapse!
  if (!content.includes('Collapse')) {
    content = content.replace(`import { CustomSelect } from './CustomSelect';`, `import { CustomSelect } from './CustomSelect';\nimport { Collapse } from './Collapse';`);
  }

  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Added collapse');
} else {
  console.log('Already added or not found');
}
