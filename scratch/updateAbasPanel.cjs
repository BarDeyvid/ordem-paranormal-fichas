const fs = require('fs');
let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');

// 1. Add simboloImg lookup
content = content.replace(
  'const corTextoElemento = obterCorTexto(elementoEscolhido);',
  'const corTextoElemento = obterCorTexto(elementoEscolhido);\n                        const simboloImg = rituaisHook.simbolosRituais?.get(ritual.Codigo_Ritual) || \'\';'
);

// 2. Add thumbnail to header
content = content.replace(
  /<div className="flex items-center gap-2\.5">\s*{\/\* PE \*\/}\s*<span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0\.5 text-xs font-bold text-blue-400">\s*{pe} PE\s*<\/span>/,
  `<div className="flex items-center gap-2.5">
                                {/* Thumbnail do símbolo (collapsed) */}
                                {simboloImg && !expandido && (
                                  <img
                                    src={simboloImg}
                                    alt=""
                                    className="h-10 w-10 rounded object-contain opacity-70"
                                    loading="lazy"
                                  />
                                )}
                                {/* PE */}
                                <span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs font-bold text-blue-400">
                                  {pe} PE
                                </span>`
);

// 3. Add image to expanded content
content = content.replace(
  /<div className="mb-4 flex flex-col gap-1">\s*{execucao && \(/,
  `<div className="flex gap-4 mb-4">
                                  {simboloImg && (
                                    <img
                                      src={simboloImg}
                                      alt=""
                                      className="h-16 w-16 rounded border border-zinc-800 bg-zinc-950/50 object-contain p-1 shrink-0"
                                      loading="lazy"
                                    />
                                  )}
                                  <div className="flex flex-col gap-1 flex-1">
                                    {execucao && (`
);

// 4. Close the new flex-col div for the metadata
content = content.replace(
  /                                      <span className="text-zinc-400">{dados}<\/span>\s*<\/div>\s*\)}\s*<\/div>\s*<\/div>\s*<\/Collapse>/,
  `                                      <span className="text-zinc-400">{dados}</span>
                                    </div>
                                  )}
                                  </div>
                                </div>

                              </div>
                            </Collapse>`
);

fs.writeFileSync('src/screens/Ficha/AbasPanel.tsx', content);
console.log('Script executed');
