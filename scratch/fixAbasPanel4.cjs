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

// 3. Replace opening div of the metadata block
content = content.replace(
  `                                <div className="mb-4 flex flex-col gap-1">
                                  {execucao && (`,
  `                                <div className="mb-4 flex gap-4 items-center">
                                  <div className="flex flex-col gap-1 flex-1">
                                    {execucao && (`
);

// 4. Replace closing div of the metadata block
content = content.replace(
  `                                  {dados && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Dados: </span>
                                      <span className="text-zinc-400">{dados}</span>
                                    </div>
                                  )}
                                </div>

                              </div>
                            </Collapse>`,
  `                                  {dados && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Dados: </span>
                                      <span className="text-zinc-400">{dados}</span>
                                    </div>
                                  )}
                                  </div>
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

// 5. Update modals
content = content.replace(
  /<ModalRituais\s+rituais={rituaisHook\.rituais}/,
  `<ModalRituais\n          simbolosRituais={rituaisHook.simbolosRituais}\n          rituais={rituaisHook.rituais}`
);

content = content.replace(
  /<ModalRituaisExtra\s+rituais={rituaisHook\.rituais}/,
  `<ModalRituaisExtra\n          simbolosRituais={rituaisHook.simbolosRituais}\n          rituais={rituaisHook.rituais}`
);

fs.writeFileSync(file, content);
console.log('Fixed AbasPanel.tsx correctly');
