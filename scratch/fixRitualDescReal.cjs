const fs = require('fs');

let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

const search = `                    <div className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded border border-zinc-800 leading-relaxed whitespace-pre-wrap mt-1">
                       <div dangerouslySetInnerHTML={{__html: formatarTexto(efeito)}} />
                    </div>`;

const replace = `                    <div className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded border border-zinc-800 leading-relaxed mt-1">
                      {(() => {
                        let currentScope = 'normal';
                        const desc = ritualA.customDesc || base.Descricao_Ritual;
                        if (!desc) return null;
                        return desc.split('\\n').map((linha, i) => {
                          const linhaLower = linha.trim().toLowerCase();
                          const isHeaderDiscente = linhaLower.startsWith('*discente') || linhaLower.startsWith('discente');
                          const isHeaderVerdadeiro = linhaLower.startsWith('*verdadeiro') || linhaLower.startsWith('verdadeiro');
                          if (isHeaderDiscente || isHeaderVerdadeiro) {
                            if (isHeaderDiscente && currentScope !== 'discente') currentScope = 'discente';
                            if (isHeaderVerdadeiro && currentScope !== 'verdadeiro') currentScope = 'verdadeiro';
                          }

                          const style = (currentScope === 'discente' || currentScope === 'verdadeiro') ? 'ml-3 mt-1' : 'mb-2';
                          if (isHeaderDiscente || isHeaderVerdadeiro) {
                            return <div key={i} className="font-bold text-zinc-300 mt-2 mb-1 border-b border-zinc-800 pb-1">{linha}</div>;
                          }
                          return linha.trim() ? <div key={i} className={style} dangerouslySetInnerHTML={{__html: formatarTexto(linha)}} /> : null;
                        });
                      })()}
                    </div>`;

if (content.includes(search)) {
  content = content.replace(search, replace);
}

// Now replace where `efeito` is computed to correctly compute `efeito` and NOT overwrite it with `customDesc`.
// We have to use substring search around the `efeito` computation.
const efeitoSearch = `const efeito = ritualA.customDesc || obterValorVersao(base.Efeito_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);`;
const efeitoReplace = `const efeito = ritualA.customProps?.[versao]?.Efeito_Ritual ?? obterValorVersao(base.Efeito_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);`;

if (content.includes(efeitoSearch)) {
  content = content.replace(efeitoSearch, efeitoReplace);
}

// Also inject the Efeito into the grid!
const gridSearch = `{resist && resist !== 'Nenhum' && <div className="col-span-2"><span className="text-zinc-500 font-bold">RESIST.:</span> <span className="text-zinc-300">{resist}</span></div>}`;
const gridReplace = `{efeito && efeito !== 'Nenhum' && <div className="col-span-2"><span className="text-zinc-500 font-bold">EFEITO:</span> <span className="text-zinc-300">{efeito}</span></div>}
                      {resist && resist !== 'Nenhum' && <div className="col-span-2"><span className="text-zinc-500 font-bold">RESIST.:</span> <span className="text-zinc-300">{resist}</span></div>}`;

if (content.includes(gridSearch) && !content.includes(`EFEITO:`)) {
  content = content.replace(gridSearch, gridReplace);
}

fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
console.log('Fixed desc and efeito rendering');
