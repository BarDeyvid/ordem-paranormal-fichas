const fs = require('fs');

let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

const search = `                      {(() => {
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
                            let canCast = true;
                            if (isHeaderDiscente) {
                              canCast = base.Circulo_Ritual === 4 ? true : verificarAcessoCirculo(base.Circulo_Ritual + 1, nivel, classe);
                            } else if (isHeaderVerdadeiro) {
                              canCast = base.Circulo_Ritual >= 3 ? true : verificarAcessoCirculo(base.Circulo_Ritual + 2, nivel, classe);
                            }
                            const colorClass = canCast ? 'text-zinc-300' : 'text-zinc-600';
                            return <div key={i} className={\`mt-2 mb-1 border-b border-zinc-800 pb-1 \${colorClass}\`} dangerouslySetInnerHTML={{__html: formatarDescricao(linha)}} />;
                          }
                          return linha.trim() ? <div key={i} className={style} dangerouslySetInnerHTML={{__html: formatarDescricao(linha)}} /> : null;
                        });
                      })()}`;

const replace = `                      {(() => {
                        let currentScope = 'normal';
                        const desc = ritualA.customDesc || base.Descricao_Ritual;
                        if (!desc) return null;
                        return desc.split('\\n').map((linha, i) => {
                          const linhaLower = linha.trim().toLowerCase();
                          const isHeaderDiscente = linhaLower.startsWith('*discente') || linhaLower.startsWith('discente');
                          const isHeaderVerdadeiro = linhaLower.startsWith('*verdadeiro') || linhaLower.startsWith('verdadeiro');

                          if (isHeaderDiscente) currentScope = 'discente';
                          if (isHeaderVerdadeiro) currentScope = 'verdadeiro';

                          let dimmed = false;
                          if (currentScope === 'discente' && versao !== 'discente') dimmed = true;
                          if (currentScope === 'verdadeiro' && versao !== 'verdadeiro') dimmed = true;

                          return (
                            <span
                              key={i}
                              className={\`block \${dimmed ? 'opacity-50' : ''} \${currentScope !== 'normal' && !dimmed ? 'text-zinc-300' : ''}\`}
                              style={{ transition: 'opacity 0.2s ease' }}
                              dangerouslySetInnerHTML={{ __html: formatarDescricao(linha) }}
                            />
                          );
                        });
                      })()}`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Fixed Sortable desc parsing');
} else {
  console.log('Not found');
}
