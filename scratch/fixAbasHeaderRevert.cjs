const fs = require('fs');

let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');

const regex = /(<div\s+onClick=\{\(\) =>[\s\S]*?className="flex cursor-pointer items-center justify-between gap-2 bg-zinc-800\/60 px-4 py-3 transition hover:bg-zinc-700\/50"\s*>)(\s*<div className="flex flex-col gap-1">[\s\S]*?)(<Collapse isOpen=\{expandido\}>)/;

const match = content.match(regex);
if (!match) {
  console.log("Could not match AbasPanel header");
} else {
  let openTag = match[1].replace('items-center justify-between gap-2', 'justify-between gap-3 relative').replace('hover:bg-zinc-700/50"', 'hover:bg-zinc-700/50 ${simboloImg ? \'items-stretch\' : \'items-center\'}"');

  const innerBody = `
                              <div className="flex items-center gap-3">
                                {simboloImg && (
                                  <img
                                    src={simboloImg}
                                    alt=""
                                    loading="lazy"
                                    className={\`h-20 w-20 object-contain drop-shadow-md shrink-0 -my-3 transition-opacity duration-200 \${expandido ? 'opacity-0' : 'opacity-100'}\`}
                                  />
                                )}
                                <div className="flex flex-col gap-1 justify-center py-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-zinc-100">{ritual.customNome || ritual.Nome_Ritual}</span>
                                    <span className="rounded bg-blue-950/30 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-900/50">
                                      {pe} PE
                                    </span>
                                  </div>
                                  {/* Dados abaixo do título — todas as versões, ativa acesa */}
                                  {ritual.Dados_Ritual && (() => {
                                    const partesDados = ritual.Dados_Ritual.split('/').map(p => p.trim());
                                    const normal = partesDados[0];
                                    if (partesDados.length === 1 && normal) {
                                      return <span className="text-sm font-bold text-zinc-100">{normal}</span>;
                                    }
                                    const preenchidas = partesDados.map(p => p || normal);
                                    if (!preenchidas.some(p => p)) return null;
                                    let ativo = 0;
                                    if (versao === 'discente') ativo = 1;
                                    if (versao === 'verdadeiro') {
                                      ativo = (ritual.Tem_Discente && ritual.Tem_Verdadeiro) ? 2 : 1;
                                    }
                                    return (
                                      <div className="flex items-center gap-2">
                                        {preenchidas.map((parte, idx) => (
                                          <React.Fragment key={idx}>
                                            {idx > 0 && <span className="text-xs text-zinc-700">›</span>}
                                            <span
                                              className={\`text-sm font-bold transition-all duration-200 \${idx === ativo ? 'text-zinc-100' : 'text-zinc-600'}\`}
                                            >
                                              {parte}
                                            </span>
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>

                              <div className={\`flex flex-col justify-between shrink-0 ml-2 \${simboloImg ? 'items-end py-1' : 'items-end'}\`}>
                                {/* Badge do elemento */}
                                <span
                                  className={\`inline-flex items-center gap-1.5 rounded px-2 py-0.5 uppercase tracking-wider leading-tight \${
                                    (() => {
                                      const elStr = elementoEscolhido.toLowerCase();
                                      if (elStr.includes('medo')) return 'bg-zinc-200/80 text-zinc-950 px-1';
                                      if (elStr.includes('sangue')) return 'text-red-500';
                                      if (elStr.includes('morte')) return 'bg-black/50 text-white px-1';
                                      if (elStr.includes('conhecimento')) return 'text-yellow-500';
                                      if (elStr.includes('energia')) return 'text-purple-500';
                                      return 'text-zinc-400';
                                    })()
                                  }\`}
                                >
                                  <span className="text-[9px] font-bold">{elementoEscolhido}</span>
                                  <span className="text-[11px] font-black">{ritual.Circulo_Ritual}</span>
                                </span>

                                <div className={\`flex items-center gap-2 \${simboloImg ? 'mt-auto' : 'mt-2'}\`}>
                                  {/* Seta */}
                                  <span className="text-xs text-zinc-600 ml-1">{expandido ? '▲' : '▼'}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* ══════ CONTEÚDO EXPANDIDO ══════ */}
                            `;

  content = content.replace(regex, openTag + innerBody + match[3]);
  fs.writeFileSync('src/screens/Ficha/AbasPanel.tsx', content);
  console.log("AbasPanel header fixed");
}
