const fs = require('fs');
let content = fs.readFileSync('src/components/ModalRituais.tsx', 'utf8').replace(/\r\n/g, '\n');

const orig = `                          <span className="text-zinc-400">{ritual.Resistencia_Ritual?.split('/')[0].trim()}</span></div>}
                        </div>
                      </Collapse>`;

const repl = `                          <span className="text-zinc-400">{ritual.Resistencia_Ritual?.split('/')[0].trim()}</span></div>}
                        </div>
                        {simboloImg && (
                          <img
                            src={simboloImg}
                            alt=""
                            className="w-48 h-48 object-contain shrink-0 drop-shadow-lg"
                          />
                        )}
                      </div>
                    </Collapse>`;

content = content.split(orig).join(repl);

const divOrig = `<div className="mb-2 flex flex-col gap-1 border-b border-zinc-800/50 pb-3">
                          {ritual.Execucao_Ritual && <div className="text-xs">`;

const divRepl = `<div className="mb-3 flex gap-4 items-center border-b border-zinc-800/50 pb-3">
                        <div className="flex flex-col gap-1 flex-1">
                          {ritual.Execucao_Ritual && <div className="text-xs">`;

content = content.split(divOrig).join(divRepl);

fs.writeFileSync('src/components/ModalRituais.tsx', content);
console.log('Fixed ModalRituais.tsx');
