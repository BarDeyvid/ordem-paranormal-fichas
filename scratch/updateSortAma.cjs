const fs = require('fs');
const content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

// Ensure CustomSelect is imported
let newContent = content;
if (!newContent.includes('CustomSelect')) {
  newContent = newContent.replace('import { Collapse }', 'import { Collapse }\nimport { CustomSelect } from \'./CustomSelect\'');
}

// Ensure proper destructuring
if (newContent.includes('const { modificacoesHook } = useRPG();')) {
  newContent = newContent.replace(
    'const { modificacoesHook } = useRPG();',
    'const { modificacoesHook, rituaisHook, itensAmaldicoadosHook, versaoRitual, setVersaoRitual } = useRPG();'
  );
}

const functionToAdd = `
function obterValorVersao(
  campo: string,
  versao: string,
  temDiscente: boolean,
  temVerdadeiro: boolean
): string {
  if (!campo || versao === 'normal') {
    if (campo && campo.includes('/')) return campo.split('/')[0].trim();
    return campo || '';
  }
  const partes = campo.split('/').map(p => p.trim());
  const normal = partes[0];
  if (partes.length === 1) return normal;
  if (versao === 'discente') return partes[1] || normal;
  if (versao === 'verdadeiro') {
    if (temDiscente && temVerdadeiro) return partes[2] || normal;
    return partes[1] || normal;
  }
  return normal;
}
`;

if (!newContent.includes('function obterValorVersao')) {
  newContent = newContent.replace('export function SortableItemAmaldicoado', functionToAdd + '\nexport function SortableItemAmaldicoado');
}

const beforeBlock = `          {item.item.Fonte_Ama && (
            <div className="mt-2 pt-2 border-t border-zinc-800/50">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">Fonte: {item.item.Fonte_Ama}</span>
            </div>
          )}`;

const ritualBlock = `          {item.item.Fonte_Ama && (
            <div className="mt-2 pt-2 border-t border-zinc-800/50">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">Fonte: {item.item.Fonte_Ama}</span>
            </div>
          )}

          {item.item.Nome_Ama === 'Selos Paranormais' && (
            <div className="mt-3 bg-zinc-950/60 border border-zinc-800 rounded p-3 flex flex-col gap-3 relative" onClick={e => e.stopPropagation()}>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest absolute -top-2.5 left-3 bg-zinc-900 px-1 border border-zinc-800 rounded-sm">
                Ritual Armazenado
              </div>
              
              <CustomSelect
                value={item.item.ritualSeloKey || ''}
                onChange={(val) => {
                  if (!val) {
                    itensAmaldicoadosHook.editarItem(item.id, { ritualSeloKey: undefined, Categoria_Ama: 'Varia', Elemento_Ama: 'Varia' });
                    return;
                  }
                  const ritual = rituaisHook.rituaisAprendidos.find(r => \`\${r.Codigo_Ritual}_\${r.Origem}\` === val);
                  if (ritual) {
                    const circulosMap: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
                    itensAmaldicoadosHook.editarItem(item.id, { 
                      ritualSeloKey: val,
                      Categoria_Ama: circulosMap[ritual.Circulo_Ritual] || 'Varia',
                      Elemento_Ama: ritual.Elemento_Ritual === 'Varia' || ritual.Elemento_Ritual === 'Lista' ? (ritual.ElementoEscolhidoPermanente || 'Sangue') : ritual.Elemento_Ritual
                    });
                  }
                }}
                options={[
                  { value: '', label: 'Nenhum ritual selecionado' },
                  ...rituaisHook.rituaisAprendidos.map(r => ({
                    value: \`\${r.Codigo_Ritual}_\${r.Origem}\`,
                    label: r.customNome || r.Nome_Ritual
                  }))
                ]}
                placeholder="Selecione um ritual..."
                className="w-full text-xs"
                wrapperClassName="w-full mt-1"
              />

              {item.item.ritualSeloKey && (() => {
                const ritual = rituaisHook.rituaisAprendidos.find(r => \`\${r.Codigo_Ritual}_\${r.Origem}\` === item.item.ritualSeloKey);
                if (!ritual) return null;
                
                const versao = versaoRitual[item.item.ritualSeloKey as any] || 'normal';
                const optionsVersao = [ { value: 'normal', label: 'Normal' } ];
                if (ritual.Tem_Discente) optionsVersao.push({ value: 'discente', label: 'Discente' });
                if (ritual.Tem_Verdadeiro) optionsVersao.push({ value: 'verdadeiro', label: 'Verdadeiro' });

                const pe = obterValorVersao(ritual.PE_Ritual, versao as any, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
                const alcance = obterValorVersao(ritual.Alcance_Ritual, versao as any, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
                const alvo = obterValorVersao(ritual.Alvo_Ritual, versao as any, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
                const duracao = obterValorVersao(ritual.Duracao_Ritual, versao as any, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
                const exec = obterValorVersao(ritual.Execucao_Ritual, versao as any, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
                const resist = obterValorVersao(ritual.Resistencia_Ritual, versao as any, ritual.Tem_Discente, ritual.Tem_Verdadeiro);

                return (
                  <div className="flex flex-col gap-2 mt-1">
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
                       <div dangerouslySetInnerHTML={{__html: formatarTexto(obterValorVersao(ritual.Efeito_Ritual, versao as any, ritual.Tem_Discente, ritual.Tem_Verdadeiro))}} />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}`;

if (newContent.includes(beforeBlock)) {
  newContent = newContent.replace(beforeBlock, ritualBlock);
} else {
  console.log('beforeBlock not found!');
}

fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', newContent);
console.log('Updated SortableItemAmaldicoado');
