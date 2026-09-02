const fs = require('fs');

function applyToAbasPanel() {
  let file = 'src/screens/Ficha/AbasPanel.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add simboloImg lookup
  content = content.replace(
    'const corTextoElemento = obterCorTexto(elementoEscolhido);',
    'const corTextoElemento = obterCorTexto(elementoEscolhido);\n                        const simboloImg = rituaisHook.simbolosRituais?.get(ritual.Codigo_Ritual) || \'\';'
  );

  // 2. Add thumbnail to header
  // Let's replace the whole right side div of the header.
  // We need it to be big (h-14 w-14 or h-16 w-16), no border.
  content = content.replace(
    /<div className="flex items-center gap-2\.5">\s*{\/\* PE \*\/}\s*<span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0\.5 text-xs font-bold text-blue-400">\s*{pe} PE\s*<\/span>/,
    `<div className="flex items-center gap-2.5">
                                {simboloImg && !expandido && (
                                  <img
                                    src={simboloImg}
                                    alt=""
                                    className="h-16 w-16 object-contain drop-shadow-md"
                                  />
                                )}
                                {/* PE */}
                                <span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs font-bold text-blue-400">
                                  {pe} PE
                                </span>`
  );

  // 3. Add image to expanded content on the RIGHT
  // Current: <div className="mb-4 flex flex-col gap-1">
  // We want to wrap it in a flex row.
  content = content.replace(
    /<div className="mb-4 flex flex-col gap-1">\s*{execucao && \(/,
    `<div className="flex gap-4 mb-4 items-start">
                                    <div className="flex flex-col gap-1 flex-1">
                                      {execucao && (`
  );

  content = content.replace(
    /                                      <span className="text-zinc-400">{dados}<\/span>\s*<\/div>\s*\)}\s*<\/div>\s*<\/div>\s*<\/Collapse>/,
    `                                      <span className="text-zinc-400">{dados}</span>
                                      </div>
                                    )}
                                    </div>
                                    {simboloImg && (
                                      <img
                                        src={simboloImg}
                                        alt=""
                                        className="w-32 h-32 object-contain shrink-0 drop-shadow-lg"
                                      />
                                    )}
                                  </div>
                                </div>

                              </div>
                            </Collapse>`
  );

  // 4. Pass simbolosRituais to Modais
  content = content.replace(
    /<ModalRituais\s+rituais={rituaisHook\.rituais}/,
    `<ModalRituais\n          simbolosRituais={rituaisHook.simbolosRituais}\n          rituais={rituaisHook.rituais}`
  );
  
  content = content.replace(
    /<ModalRituaisExtra\s+rituais={rituaisHook\.rituais}/,
    `<ModalRituaisExtra\n          simbolosRituais={rituaisHook.simbolosRituais}\n          rituais={rituaisHook.rituais}`
  );

  fs.writeFileSync(file, content);
}

function applyToModalRituais(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add prop type
  content = content.replace(
    /interface ModalRituaisProps \{/,
    'interface ModalRituaisProps {\n  simbolosRituais: Map<number, string>;'
  );
  content = content.replace(
    /interface ModalRituaisExtraProps \{/,
    'interface ModalRituaisExtraProps {\n  simbolosRituais: Map<number, string>;'
  );

  // Add prop destructure
  content = content.replace(
    /export const ModalRituais(Extra)?: React\.FC<[^>]+> = \(\{/,
    `$& \n  simbolosRituais,`
  );

  // Global Replace variable
  content = content.replace(
    /const isVaria = ritual\.Elemento_Ritual\.toLowerCase\(\) === 'lista' \|\| ritual\.Elemento_Ritual\.toLowerCase\(\) === 'varia';/g,
    `const isVaria = ritual.Elemento_Ritual.toLowerCase() === 'lista' || ritual.Elemento_Ritual.toLowerCase() === 'varia';\n                const simboloImg = simbolosRituais?.get(ritual.Codigo_Ritual) || '';`
  );

  // Thumbnail
  content = content.replace(
    /<\/div>\s*<span className="text-zinc-500 text-xs mt-1">{expandido \? '▲' : '▼'}<\/span>\s*<\/div>/g,
    `</div>
                      <div className="flex items-center gap-2.5">
                        {simboloImg && !expandido && (
                          <img
                            src={simboloImg}
                            alt=""
                            className="h-16 w-16 object-contain drop-shadow-md"
                          />
                        )}
                        <span className="text-zinc-500 text-xs mt-1">{expandido ? '▲' : '▼'}</span>
                      </div>
                    </div>`
  );

  // Expanded Image right side ModalRituais
  if (file.includes('Extra')) {
    content = content.replace(
      /<div className="mb-3 flex flex-col gap-1 border-b border-zinc-800\/50 pb-3">\s*{ritual\.Execucao_Ritual && /g,
      `<div className="flex gap-4 mb-3 border-b border-zinc-800/50 pb-3 items-start">
                        <div className="flex flex-col gap-1 flex-1">
                          {ritual.Execucao_Ritual && `
    );
    content = content.replace(
      /                        {ritual\.Resistencia_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Resistência: <\/span><span className="text-zinc-300">{ritual\.Resistencia_Ritual}<\/span><\/div>}\s*<\/div>\s*<\/Collapse>/g,
      `                        {ritual.Resistencia_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Resistência: </span><span className="text-zinc-300">{ritual.Resistencia_Ritual}</span></div>}
                        </div>
                        {simboloImg && (
                          <img
                            src={simboloImg}
                            alt=""
                            className="w-32 h-32 object-contain shrink-0 drop-shadow-lg"
                          />
                        )}
                      </div>
                    </div>
                  </Collapse>`
    );
  } else {
    content = content.replace(
      /<div className="mb-3 flex flex-col gap-1">\s*{ritual\.Execucao_Ritual && \(/g,
      `<div className="flex gap-4 mb-3 items-start">
                        <div className="flex flex-col gap-1 flex-1">
                          {ritual.Execucao_Ritual && (`
    );
    content = content.replace(
      /                          <span className="text-zinc-400">{ritual\.Resistencia_Ritual\.split\('\/'\)\[0\]}<\/span>\s*<\/div>\s*\)}\s*<\/div>\s*<\/div>\s*<\/Collapse>/g,
      `                          <span className="text-zinc-400">{ritual.Resistencia_Ritual.split('/')[0]}</span>
                          </div>
                        )}
                        </div>
                        {simboloImg && (
                          <img
                            src={simboloImg}
                            alt=""
                            className="w-32 h-32 object-contain shrink-0 drop-shadow-lg"
                          />
                        )}
                      </div>
                    </div>

                  </div>
                </Collapse>`
    );
  }

  fs.writeFileSync(file, content);
}

try {
  applyToAbasPanel();
  applyToModalRituais('src/components/ModalRituais.tsx');
  applyToModalRituais('src/components/ModalRituaisExtra.tsx');
  console.log('All files updated correctly!');
} catch (e) {
  console.error(e);
}
