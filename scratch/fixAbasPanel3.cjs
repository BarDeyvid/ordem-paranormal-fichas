const fs = require('fs');

let file = 'src/screens/Ficha/AbasPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add simboloImg lookup
content = content.replace(
  'const corTextoElemento = obterCorTexto(elementoEscolhido);',
  'const corTextoElemento = obterCorTexto(elementoEscolhido);\n                        const simboloImg = rituaisHook.simbolosRituais?.get(ritual.Codigo_Ritual) || \'\';'
);

// 2. Add thumbnail to header
content = content.replace(
  /<div className="flex items-center gap-2\.5">\s*{\/\* PE \*\/}\s*<span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0\.5 text-xs font-bold text-blue-400">\s*{pe} PE\s*<\/span>/,
  `<div className="flex items-center gap-2.5">
                                {simboloImg && !expandido && (
                                  <img
                                    src={simboloImg}
                                    alt=""
                                    className="h-20 w-20 object-contain drop-shadow-md shrink-0 -my-3"
                                  />
                                )}
                                {/* PE */}
                                <span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs font-bold text-blue-400">
                                  {pe} PE
                                </span>`
);

// 3. Add image to expanded content on the RIGHT
content = content.replace(
  /<div className="mb-4 flex flex-col gap-1">/,
  `<div className="mb-4 flex gap-4 items-center">
                                  <div className="flex flex-col gap-1 flex-1">`
);

content = content.replace(
  /                                <\/div>\s*<\/div>\s*<\/Collapse>/,
  `                                </div>
                                  {simboloImg && (
                                    <img
                                      src={simboloImg}
                                      alt=""
                                      className="w-48 h-48 object-contain shrink-0 drop-shadow-lg"
                                    />
                                  )}
                                </div>
                              </div>
                            </Collapse>`
);

fs.writeFileSync(file, content);
console.log('Fixed AbasPanel.tsx');
