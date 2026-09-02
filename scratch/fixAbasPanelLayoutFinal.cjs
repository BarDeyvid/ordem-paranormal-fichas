const fs = require('fs');

let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8').replace(/\r\n/g, '\n');

const origBlock = `<Collapse isOpen={expandido}>
                              <div className="border-t border-zinc-800 px-4 py-4 text-left text-sm leading-relaxed text-zinc-400">

                                {/* Dropdowns de configurações (Elemento e Versão) */}
                                {(isLista || versoesDisponiveis.length > 1) && (
                                  <div className="mb-4 flex flex-wrap items-center justify-between border-b border-zinc-800/50 pb-3">
                                    <div className="flex items-center gap-5">
                                      {/* Dropdown de Versão */}
                                      {versoesDisponiveis.length > 1 && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-600">Versão:</span>
                                          <CustomSelect
                                            value={versao}
                                            onChange={(val) => {
                                              setVersaoRitual(prev => ({
                                                ...prev,
                                                [chaveUnica]: val as VersaoRitual,
                                              }));
                                            }}
                                            wrapperClassName="w-[120px]"
                                            className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs font-bold text-zinc-200 outline-none transition hover:bg-zinc-800 focus:border-green-700"
                                            options={versoesDisponiveis.map(v => ({ value: v.value, label: v.label, disabled: v.disabled }))}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Campos de metadados — só mostram se têm valor */}
                                <div className="mb-4 flex gap-4 items-center">
<div className="flex flex-col gap-1 flex-1">
                                  {execucao && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Execução: </span>
                                      <span className="text-zinc-400">{execucao}</span>
                                    </div>
                                  )}
                                  {alcance && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Alcance: </span>
                                      <span className="text-zinc-400">{alcance}</span>
                                    </div>
                                  )}
                                  {area && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Área: </span>
                                      <span className="text-zinc-400">{area}</span>
                                    </div>
                                  )}
                                  {alvo && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Alvo: </span>
                                      <span className="text-zinc-400">{alvo}</span>
                                    </div>
                                  )}
                                  {duracao && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Duração: </span>
                                      <span className="text-zinc-400">{duracao}</span>
                                    </div>
                                  )}
                                  {efeito && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Efeito: </span>
                                      <span className="text-zinc-400">{efeito}</span>
                                    </div>
                                  )}
                                  {resistencia && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Resistência: </span>
                                      <span className="text-zinc-400">{resistencia}</span>
                                    </div>
                                  )}
                                  {dados && (
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
                            </Collapse>`;

const newBlock = `<Collapse isOpen={expandido}>
                              <div className="border-t border-zinc-800 px-4 py-4 text-left text-sm leading-relaxed text-zinc-400">
                                
                                <div className="flex flex-row items-center justify-between gap-4">
                                  <div className="flex flex-col flex-1 min-w-0">
                                    
                                    {/* Dropdowns de configurações (Elemento e Versão) */}
                                    {(isLista || versoesDisponiveis.length > 1) && (
                                      <div className="mb-4 flex flex-wrap items-center justify-between border-b border-zinc-800/50 pb-3">
                                        <div className="flex items-center gap-5">
                                          {/* Dropdown de Versão */}
                                          {versoesDisponiveis.length > 1 && (
                                            <div className="flex items-center gap-2">
                                              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-600">Versão:</span>
                                              <CustomSelect
                                                value={versao}
                                                onChange={(val) => {
                                                  setVersaoRitual(prev => ({
                                                    ...prev,
                                                    [chaveUnica]: val as VersaoRitual,
                                                  }));
                                                }}
                                                wrapperClassName="w-[120px]"
                                                className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs font-bold text-zinc-200 outline-none transition hover:bg-zinc-800 focus:border-green-700"
                                                options={versoesDisponiveis.map(v => ({ value: v.value, label: v.label, disabled: v.disabled }))}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Campos de metadados — só mostram se têm valor */}
                                    <div className="mb-4 flex flex-col gap-1">
                                      {execucao && (
                                        <div className="text-xs">
                                          <span className="font-bold text-zinc-300">Execução: </span>
                                          <span className="text-zinc-400">{execucao}</span>
                                        </div>
                                      )}
                                      {alcance && (
                                        <div className="text-xs">
                                          <span className="font-bold text-zinc-300">Alcance: </span>
                                          <span className="text-zinc-400">{alcance}</span>
                                        </div>
                                      )}
                                      {area && (
                                        <div className="text-xs">
                                          <span className="font-bold text-zinc-300">Área: </span>
                                          <span className="text-zinc-400">{area}</span>
                                        </div>
                                      )}
                                      {alvo && (
                                        <div className="text-xs">
                                          <span className="font-bold text-zinc-300">Alvo: </span>
                                          <span className="text-zinc-400">{alvo}</span>
                                        </div>
                                      )}
                                      {duracao && (
                                        <div className="text-xs">
                                          <span className="font-bold text-zinc-300">Duração: </span>
                                          <span className="text-zinc-400">{duracao}</span>
                                        </div>
                                      )}
                                      {efeito && (
                                        <div className="text-xs">
                                          <span className="font-bold text-zinc-300">Efeito: </span>
                                          <span className="text-zinc-400">{efeito}</span>
                                        </div>
                                      )}
                                      {resistencia && (
                                        <div className="text-xs">
                                          <span className="font-bold text-zinc-300">Resistência: </span>
                                          <span className="text-zinc-400">{resistencia}</span>
                                        </div>
                                      )}
                                      {dados && (
                                        <div className="text-xs">
                                          <span className="font-bold text-zinc-300">Dados: </span>
                                          <span className="text-zinc-400">{dados}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Símbolo do Ritual Centralizado Verticalmente */}
                                  {simboloImg && (
                                    <img
                                      src={simboloImg}
                                      alt=""
                                      className="w-32 h-32 sm:w-40 sm:h-40 mr-2 sm:mr-6 object-contain shrink-0 drop-shadow-lg"
                                    />
                                  )}
                                </div>

                              </div>
                            </Collapse>`;

if (content.includes(origBlock)) {
  content = content.replace(origBlock, newBlock);
  fs.writeFileSync('src/screens/Ficha/AbasPanel.tsx', content);
  console.log('Fixed AbasPanel.tsx Layout!');
} else {
  console.log('Could not find original block in AbasPanel.tsx');
}
