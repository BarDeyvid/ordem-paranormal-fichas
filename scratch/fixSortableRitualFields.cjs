const fs = require('fs');

let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

// 1. Fix the top title part
const titleSearch = `{item.item.Nome_Ama === 'Selos Paranormais' && item.item.ritualSeloKey ? (() => {
                 const ritual = rituaisHook.rituaisAprendidos.find(r => \`\${r.Codigo_Ritual}_\${r.Origem}\` === item.item.ritualSeloKey);
                 return ritual ? \` (\${ritual.customNome || ritual.Nome_Ritual})\` : '';
              })() : ''}`;

const titleReplace = `{item.item.Nome_Ama === 'Selos Paranormais' && item.item.ritualSeloKey ? (() => {
                 const ritualA = rituaisHook.rituaisAprendidos.find(r => \`\${r.codigo_ritual}_\${r.origem}\` === item.item.ritualSeloKey);
                 if (!ritualA) return '';
                 const base = rituaisHook.rituais.find(b => b.Codigo_Ritual === ritualA.codigo_ritual);
                 return \` (\${ritualA.customNome || (base ? base.Nome_Ritual : '')})\`;
              })() : ''}`;

if (content.includes(titleSearch)) {
  content = content.replace(titleSearch, titleReplace);
}

// 2. Fix the select onChange
const selectOnChangeSearch = `const ritual = rituaisHook.rituaisAprendidos.find(r => \`\${r.Codigo_Ritual}_\${r.Origem}\` === val);
                    if (ritual) {
                      const circulosMap: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
                      itensAmaldicoadosHook.editarItem(item.id, { 
                        ritualSeloKey: val,
                        Categoria_Ama: circulosMap[ritual.Circulo_Ritual] || 'Varia',
                        Elemento_Ama: ritual.Elemento_Ritual === 'Varia' || ritual.Elemento_Ritual === 'Lista' ? (ritual.ElementoEscolhidoPermanente || 'Sangue') : ritual.Elemento_Ritual
                      });
                    }`;

const selectOnChangeReplace = `const ritualA = rituaisHook.rituaisAprendidos.find(r => \`\${r.codigo_ritual}_\${r.origem}\` === val);
                    if (ritualA) {
                      const base = rituaisHook.rituais.find(b => b.Codigo_Ritual === ritualA.codigo_ritual);
                      if (base) {
                        const circulosMap: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
                        itensAmaldicoadosHook.editarItem(item.id, { 
                          ritualSeloKey: val,
                          Categoria_Ama: circulosMap[base.Circulo_Ritual] || 'Varia',
                          Elemento_Ama: base.Elemento_Ritual === 'Varia' || base.Elemento_Ritual === 'Lista' ? (ritualA.elemento_escolhido || 'Sangue') : base.Elemento_Ritual
                        });
                      }
                    }`;

if (content.includes(selectOnChangeSearch)) {
  content = content.replace(selectOnChangeSearch, selectOnChangeReplace);
}

// 3. Fix the select options
const selectOptionsSearch = `...rituaisHook.rituaisAprendidos.map(r => ({
                    value: \`\${r.Codigo_Ritual}_\${r.Origem}\`,
                    label: r.customNome || r.Nome_Ritual
                  }))`;

const selectOptionsReplace = `...rituaisHook.rituaisAprendidos.map(r => {
                    const base = rituaisHook.rituais.find(b => b.Codigo_Ritual === r.codigo_ritual);
                    return {
                      value: \`\${r.codigo_ritual}_\${r.origem}\`,
                      label: r.customNome || (base ? base.Nome_Ritual : 'Ritual Desconhecido')
                    };
                  })`;

if (content.includes(selectOptionsSearch)) {
  content = content.replace(selectOptionsSearch, selectOptionsReplace);
}

// 4. Fix the block render
const blockRenderSearch = `const ritual = rituaisHook.rituaisAprendidos.find(r => \`\${r.Codigo_Ritual}_\${r.Origem}\` === item.item.ritualSeloKey);
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
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-zinc-100">{ritual.customNome || ritual.Nome_Ritual}</h4>
                    </div>`;

const blockRenderReplace = `const ritualA = rituaisHook.rituaisAprendidos.find(r => \`\${r.codigo_ritual}_\${r.origem}\` === item.item.ritualSeloKey);
                if (!ritualA) return null;
                const base = rituaisHook.rituais.find(b => b.Codigo_Ritual === ritualA.codigo_ritual);
                if (!base) return null;
                
                const versao = versaoRitual[item.item.ritualSeloKey as any] || 'normal';
                const optionsVersao = [ { value: 'normal', label: 'Normal' } ];
                if (base.Tem_Discente) optionsVersao.push({ value: 'discente', label: 'Discente' });
                if (base.Tem_Verdadeiro) optionsVersao.push({ value: 'verdadeiro', label: 'Verdadeiro' });

                const pe = obterValorVersao(base.PE_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);
                const alcance = ritualA.customProps?.[versao]?.Alcance_Ritual ?? obterValorVersao(base.Alcance_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);
                const alvo = ritualA.customProps?.[versao]?.Alvo_Ritual ?? obterValorVersao(base.Alvo_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);
                const duracao = ritualA.customProps?.[versao]?.Duracao_Ritual ?? obterValorVersao(base.Duracao_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);
                const exec = ritualA.customProps?.[versao]?.Execucao_Ritual ?? obterValorVersao(base.Execucao_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);
                const resist = ritualA.customProps?.[versao]?.Resistencia_Ritual ?? obterValorVersao(base.Resistencia_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);
                const efeito = ritualA.customDesc || obterValorVersao(base.Efeito_Ritual, versao as any, base.Tem_Discente, base.Tem_Verdadeiro);

                return (
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-zinc-100">{ritualA.customNome || base.Nome_Ritual}</h4>
                    </div>`;

if (content.includes(blockRenderSearch)) {
  content = content.replace(blockRenderSearch, blockRenderReplace);
}

// 5. Fix Efeito render
const efeitoRenderSearch = `<div dangerouslySetInnerHTML={{__html: formatarTexto(obterValorVersao(ritual.Efeito_Ritual, versao as any, ritual.Tem_Discente, ritual.Tem_Verdadeiro))}} />`;
const efeitoRenderReplace = `<div dangerouslySetInnerHTML={{__html: formatarTexto(efeito)}} />`;

if (content.includes(efeitoRenderSearch)) {
  content = content.replace(efeitoRenderSearch, efeitoRenderReplace);
}

fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
console.log('Fixed undefined fields');
