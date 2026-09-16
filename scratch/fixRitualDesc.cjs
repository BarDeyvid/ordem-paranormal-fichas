const fs = require('fs');

let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

// The stats block
const search1 = `const efeito = ritualA.customDesc || obterValorVersao(base.Efeito_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);

                return (
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-zinc-100">{ritualA.customNome || base.Nome_Ritual}</h4>
                    </div>
                    <div className="flex justify-between items-center bg-zinc-900 rounded p-1.5 border border-zinc-800">
                       <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider ml-1">Custo: <span className="text-zinc-300">{pe}</span></span>
                       {optionsVersao.length > 1 && (
                         <CustomSelect
                           value={versao}
                           onChange={(v) => setVersaoRitual(prev => ({...prev, [item.item.ritualSeloKey as string]: v as any}))}
                           options={optionsVersao}
                           hideIcon
                           wrapperClassName="!min-w-[100px]"
                           className="text-[10px] py-1 min-h-0 bg-transparent border-none text-zinc-400 font-bold uppercase tracking-wider text-right cursor-pointer hover:text-green-400 focus:text-green-400"
                         />
                       )}
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">
                      {exec && exec !== 'Nenhum' && <div><span className="text-zinc-500 font-bold">EXEC.:</span> <span className="text-zinc-300">{exec}</span></div>}
                      {alcance && alcance !== 'Nenhum' && <div><span className="text-zinc-500 font-bold">ALCANCE:</span> <span className="text-zinc-300">{alcance}</span></div>}
                      {alvo && alvo !== 'Nenhum' && <div><span className="text-zinc-500 font-bold">ALVO:</span> <span className="text-zinc-300">{alvo}</span></div>}
                      {duracao && duracao !== 'Nenhum' && <div><span className="text-zinc-500 font-bold">DURAÇÃO:</span> <span className="text-zinc-300">{duracao}</span></div>}
                      {resist && resist !== 'Nenhum' && <div className="col-span-2"><span className="text-zinc-500 font-bold">RESIST.:</span> <span className="text-zinc-300">{resist}</span></div>}
                    </div>

                    <div className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded border border-zinc-800 leading-relaxed whitespace-pre-wrap mt-1">
                       <div dangerouslySetInnerHTML={{__html: formatarTexto(efeito)}} />
                    </div>`;

const replace1 = `const efeito = ritualA.customProps?.[versao]?.Efeito_Ritual ?? obterValorVersao(base.Efeito_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);
                const descricao = ritualA.customDesc || base.Descricao_Ritual;

                return (
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-zinc-100">{ritualA.customNome || base.Nome_Ritual}</h4>
                    </div>
                    <div className="flex justify-between items-center bg-zinc-900 rounded p-1.5 border border-zinc-800">
                       <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider ml-1">Custo: <span className="text-zinc-300">{pe}</span></span>
                       {optionsVersao.length > 1 && (
                         <CustomSelect
                           value={versao}
                           onChange={(v) => setVersaoRitual(prev => ({...prev, [item.item.ritualSeloKey as string]: v as any}))}
                           options={optionsVersao}
                           hideIcon
                           wrapperClassName="!min-w-[100px]"
                           className="text-[10px] py-1 min-h-0 bg-transparent border-none text-zinc-400 font-bold uppercase tracking-wider text-right cursor-pointer hover:text-green-400 focus:text-green-400"
                         />
                       )}
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">
                      {exec && exec !== 'Nenhum' && <div><span className="text-zinc-500 font-bold">EXEC.:</span> <span className="text-zinc-300">{exec}</span></div>}
                      {alcance && alcance !== 'Nenhum' && <div><span className="text-zinc-500 font-bold">ALCANCE:</span> <span className="text-zinc-300">{alcance}</span></div>}
                      {alvo && alvo !== 'Nenhum' && <div><span className="text-zinc-500 font-bold">ALVO:</span> <span className="text-zinc-300">{alvo}</span></div>}
                      {duracao && duracao !== 'Nenhum' && <div><span className="text-zinc-500 font-bold">DURAÇÃO:</span> <span className="text-zinc-300">{duracao}</span></div>}
                      {efeito && efeito !== 'Nenhum' && <div className="col-span-2"><span className="text-zinc-500 font-bold">EFEITO:</span> <span className="text-zinc-300">{efeito}</span></div>}
                      {resist && resist !== 'Nenhum' && <div className="col-span-2"><span className="text-zinc-500 font-bold">RESIST.:</span> <span className="text-zinc-300">{resist}</span></div>}
                    </div>

                    <div className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded border border-zinc-800 leading-relaxed whitespace-pre-wrap mt-1">
                       <div dangerouslySetInnerHTML={{__html: formatarTexto(descricao)}} />
                    </div>`;

if (content.includes(search1)) {
  content = content.replace(search1, replace1);
  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Fixed block desc');
} else {
  console.log('Not found');
}
