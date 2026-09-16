const fs = require('fs');

let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');

const search = `                                        const style = (currentScope === 'discente' || currentScope === 'verdadeiro') ? 'ml-3 mt-1' : 'mb-2';
                                        if (isHeaderDiscente || isHeaderVerdadeiro) {
                                          return <div key={i} className="font-bold text-zinc-300 mt-2 mb-1 border-b border-zinc-800 pb-1">{linha}</div>;
                                        }
                                        return linha.trim() ? <div key={i} className={style} dangerouslySetInnerHTML={{__html: formatarTexto(linha)}} /> : null;`;

const replace = `                                        const style = (currentScope === 'discente' || currentScope === 'verdadeiro') ? 'ml-3 mt-1' : 'mb-2';
                                        if (isHeaderDiscente || isHeaderVerdadeiro) {
                                          let canCast = true;
                                          if (isHeaderDiscente) {
                                            canCast = ritual.Circulo_Ritual === 4 ? true : verificarAcessoCirculo(ritual.Circulo_Ritual + 1, nivel, classe);
                                          } else if (isHeaderVerdadeiro) {
                                            canCast = ritual.Circulo_Ritual >= 3 ? true : verificarAcessoCirculo(ritual.Circulo_Ritual + 2, nivel, classe);
                                          }
                                          const colorClass = canCast ? 'text-zinc-300' : 'text-zinc-600';
                                          return <div key={i} className={\`mt-2 mb-1 border-b border-zinc-800 pb-1 \${colorClass}\`} dangerouslySetInnerHTML={{__html: formatarDescricao(linha)}} />;
                                        }
                                        return linha.trim() ? <div key={i} className={style} dangerouslySetInnerHTML={{__html: formatarDescricao(linha)}} /> : null;`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/screens/Ficha/AbasPanel.tsx', content);
  console.log('Fixed AbasPanel');
} else {
  console.log('Not found');
}
