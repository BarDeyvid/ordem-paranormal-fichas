const fs = require('fs');

let content = fs.readFileSync('src/components/ModalRituaisExtra.tsx', 'utf8');

const startStr = 'className="flex cursor-pointer items-start justify-between gap-3 p-3"';
const startIndex = content.indexOf(startStr);
const divStart = content.lastIndexOf('<div', startIndex);

const endStr = 'className="text-zinc-500 text-xs mt-1">{expandido ? \'▲\' : \'▼\'}</span>';
const endIndex = content.indexOf(endStr, startIndex) + endStr.length;
const fullEndIndex = content.indexOf('</div>', endIndex) + 6;
const secondFullEndIndex = content.indexOf('</div>', fullEndIndex) + 6;

const oldBlock = content.substring(divStart, secondFullEndIndex);

const newBlock = `<div onClick={() => setExpandidos(prev => prev.includes(codigo) ? prev.filter(id => id !== codigo) : [...prev, codigo])} className={\`flex justify-between gap-3 px-4 py-3 cursor-pointer relative \${simboloImg ? 'items-stretch' : 'items-center'}\`}>
                      {/* LADO ESQUERDO */}
                      <div className="flex items-center gap-3">
                        {simboloImg && (
                          <img
                            src={simboloImg}
                            loading="lazy"
                            alt=""
                            className={\`h-20 w-20 object-contain drop-shadow-md shrink-0 -my-3 transition-opacity duration-200 \${expandido ? 'opacity-0' : 'opacity-100'}\`}
                          />
                        )}
                        <div className="flex flex-col gap-1 justify-center py-1">
                          <span className="text-sm font-bold text-zinc-200 group-hover:text-green-400 transition">{ritual.Nome_Ritual}</span>
                        </div>
                      </div>

                      {/* LADO DIREITO */}
                      <div className={\`flex flex-col justify-between shrink-0 ml-2 \${simboloImg ? 'items-end py-1' : 'items-end'}\`}>
                        <span className="inline-flex items-center gap-1.5 rounded uppercase tracking-wider leading-tight">
                          {(() => {
                            const elStr = elementoSendoEscolhido;
                            
                            const getClasses = (el) => {
                              const l = el.toLowerCase();
                              if(l.includes('sangue')) return 'text-red-500';
                              if(l.includes('conhecimento')) return 'text-yellow-500';
                              if(l.includes('energia')) return 'text-purple-500';
                              if(l.includes('morte')) return 'bg-black/50 text-white px-1 rounded';
                              if(l.includes('medo')) return 'bg-zinc-200/80 text-zinc-950 px-1 rounded';
                              return 'text-zinc-400';
                            };

                            if (elStr.includes(' e ')) {
                              const partes = elStr.split(' e ');
                              const p1 = partes[0].trim();
                              const p2 = partes[1].trim();
                              const c1 = getClasses(p1);
                              const c2 = getClasses(p2);
                              return (
                                <>
                                  <span className={\`text-[9px] font-bold flex items-center gap-1 \${c1}\`}>{p1}</span>
                                  <span className="text-zinc-500 text-[10px] lowercase font-bold">e</span>
                                  <span className={\`text-[9px] font-bold flex items-center gap-1 \${c2}\`}>
                                    {p2}
                                    <span className="text-[11px] font-black">{ritual.Circulo_Ritual}</span>
                                  </span>
                                </>
                              );
                            }
                            const c1 = getClasses(elStr);
                            return (
                              <span className={\`text-[9px] font-bold flex items-center gap-1.5 \${c1}\`}>
                                {elStr}
                                <span className="text-[11px] font-black">{ritual.Circulo_Ritual}</span>
                              </span>
                            );
                          })()}
                        </span>
                        
                        <div className={\`flex items-center gap-2 \${simboloImg ? 'mt-auto' : 'mt-2'}\`}>
                          <span className="text-zinc-500 text-xs ml-1">{expandido ? '▲' : '▼'}</span>
                        </div>
                      </div>
                    </div>`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync('src/components/ModalRituaisExtra.tsx', content);
console.log('Fixed ModalRituaisExtra.tsx');
