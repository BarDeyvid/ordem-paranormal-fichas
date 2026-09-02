const fs = require('fs');
let content = fs.readFileSync('src/components/ModalRituaisExtra.tsx', 'utf8');

// Global replaces
content = content.replace(
  /const isVaria = ritual\.Elemento_Ritual\.toLowerCase\(\) === 'lista' \|\| ritual\.Elemento_Ritual\.toLowerCase\(\) === 'varia';/g,
  `const isVaria = ritual.Elemento_Ritual.toLowerCase() === 'lista' || ritual.Elemento_Ritual.toLowerCase() === 'varia';
              const simboloImg = rituaisHook.simbolosRituais?.get(ritual.Codigo_Ritual) || '';`
);

content = content.replace(
  /                    <\/div>\s*<span className="text-zinc-500 text-xs mt-1">{expandido \? '▲' : '▼'}<\/span>\s*<\/div>/g,
  `                    </div>
                    <div className="flex items-center gap-2.5">
                      {simboloImg && !expandido && (
                        <img
                          src={simboloImg}
                          alt=""
                          className="h-10 w-10 rounded object-contain opacity-70"
                          loading="lazy"
                        />
                      )}
                      <span className="text-zinc-500 text-xs mt-1">{expandido ? '▲' : '▼'}</span>
                    </div>
                  </div>`
);

content = content.replace(
  /<div className="mb-3 flex flex-col gap-1 border-b border-zinc-800\/50 pb-3">\s*{ritual\.Execucao_Ritual && /g,
  `<div className="flex gap-4 mb-3 border-b border-zinc-800/50 pb-3">
                      {simboloImg && (
                        <img
                          src={simboloImg}
                          alt=""
                          className="h-16 w-16 rounded border border-zinc-800 bg-zinc-950/50 object-contain p-1 shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex flex-col gap-1 flex-1">
                        {ritual.Execucao_Ritual && `
);

content = content.replace(
  /                        {ritual\.Resistencia_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Resistência: <\/span><span className="text-zinc-300">{ritual\.Resistencia_Ritual}<\/span><\/div>}\s*<\/div>\s*<\/Collapse>/g,
  `                        {ritual.Resistencia_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Resistência: </span><span className="text-zinc-300">{ritual.Resistencia_Ritual}</span></div>}
                      </div>
                    </div>
                  </Collapse>`
);

fs.writeFileSync('src/components/ModalRituaisExtra.tsx', content);
console.log('Done ModalRituaisExtra');
