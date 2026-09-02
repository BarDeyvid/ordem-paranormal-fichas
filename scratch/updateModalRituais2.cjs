const fs = require('fs');
let content = fs.readFileSync('src/components/ModalRituais.tsx', 'utf8');

content = content.replace(
  "const isLista = ritual.Elemento_Ritual.toLowerCase() === 'lista' || ritual.Elemento_Ritual.toLowerCase() === 'varia';",
  "const isLista = ritual.Elemento_Ritual.toLowerCase() === 'lista' || ritual.Elemento_Ritual.toLowerCase() === 'varia';\n                const simboloImg = rituaisHook.simbolosRituais?.get(ritual.Codigo_Ritual) || '';"
);

content = content.replace(
  /                      <\/div>\s*<span className="text-zinc-500 text-xs mt-1">{expandido \? '▲' : '▼'}<\/span>\s*<\/div>/,
  `                      </div>
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
  /<div className="flex flex-col gap-1">\s*{ritual\.Execucao_Ritual && \(/,
  `<div className="flex gap-4 mb-2">
                      {simboloImg && (
                        <img
                          src={simboloImg}
                          alt=""
                          className="h-16 w-16 rounded border border-zinc-800 bg-zinc-950/50 object-contain p-1 shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex flex-col gap-1 flex-1">
                        {ritual.Execucao_Ritual && (`
);

content = content.replace(
  /                          <span className="text-zinc-400">{ritual\.Resistencia_Ritual\.split\('\/'\)\[0\]}<\/span>\s*<\/div>\s*\)}\s*<\/div>\s*<\/div>\s*<\/Collapse>/,
  `                          <span className="text-zinc-400">{ritual.Resistencia_Ritual.split('/')[0]}</span>
                        </div>
                      )}
                      </div>
                    </div>

                  </div>
                </Collapse>`
);

fs.writeFileSync('src/components/ModalRituais.tsx', content);
console.log('ModalRituais updated');
