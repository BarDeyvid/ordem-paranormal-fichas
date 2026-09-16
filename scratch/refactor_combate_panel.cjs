const fs = require('fs');

let c = fs.readFileSync('src/screens/Ficha/CombatePanel.tsx', 'utf8');

// Add Collapse import
c = c.replace(
  "import type { ArmaInventario } from '../../types';",
  "import type { ArmaInventario } from '../../types';\nimport { Collapse } from '../../components/Collapse';"
);

// Add expandidos state
c = c.replace(
  "export const CombatePanel: React.FC = () => {",
  "export const CombatePanel: React.FC = () => {\n  const [expandidos, setExpandidos] = React.useState<Record<string, boolean>>({});\n\n  const toggleExpandir = (id: string) => {\n    setExpandidos(prev => ({ ...prev, [id]: !prev[id] }));\n  };"
);

// We need to rewrite the mapped element logic. 
// It currently uses <div key={armaInv.id} className="flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
const regexOldMap = /return \(\s*<div key=\{armaInv\.id\} className="flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900\/50">[\s\S]*?\n\s*\}\);\n\s*\}\)\}/g;

const newMap = `
          const estaExpandida = !!expandidos[armaInv.id];

          return (
            <div
              key={armaInv.id}
              className="overflow-hidden rounded-r-lg border-l-4 border-green-800 bg-zinc-900/60 transition hover:bg-zinc-900"
            >
              {/* CABEÇALHO (CLICÁVEL) */}
              <div 
                className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"
                onClick={() => toggleExpandir(armaInv.id)}
              >
                <div className="flex flex-1 items-center gap-3">
                  <span className={\`text-xs text-zinc-600 transition-transform \${estaExpandida ? 'rotate-180' : ''}\`}>▼</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-zinc-100">{arma.Nome_Item}</span>
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-zinc-400">
                        {arma.Tipo_Dano_Arma || 'Físico'}
                      </span>
                    </div>
                    {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {modsAtivas.map(m => (
                          <span key={m!.Codigo_Modif} className="rounded border border-zinc-700 bg-zinc-800/50 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-zinc-300">
                            {m!.Nome_Modificacao}
                          </span>
                        ))}
                        {maldicoesAtivas.map(m => (
                          <span key={m!.Codigo_Modif} className="rounded border border-purple-900/50 bg-purple-950/30 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-purple-400">
                            {m!.Nome_Modificacao}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {bonusAtaqueStr && (
                  <div className="flex flex-col items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-center">
                    <span className="text-[0.6rem] font-bold uppercase tracking-wider text-zinc-400">Ataque</span>
                    <span className="text-sm font-bold text-zinc-200">{bonusAtaqueStr}</span>
                  </div>
                )}
              </div>

              {/* CONTEÚDO EXPANSÍVEL */}
              <Collapse isOpen={estaExpandida}>
                <div className="border-t border-zinc-800 px-5 pb-5 pt-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex flex-1 flex-col gap-3">
                      <div className="flex justify-between rounded bg-zinc-950/50 px-3 py-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Dano Base</span>
                        <span className="text-sm font-bold text-zinc-200">{arma.Dano_Arma}</span>
                      </div>
                      
                      {arma.Dano_Secundario && arma.Dano_Secundario.trim() !== '-' && (
                        <div className="flex justify-between rounded bg-zinc-950/50 px-3 py-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Dano Sec.</span>
                          <span className="text-sm font-bold text-zinc-200">{arma.Dano_Secundario}</span>
                        </div>
                      )}

                      <div className="flex justify-between rounded bg-zinc-950/50 px-3 py-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Crítico</span>
                        <span className="text-sm font-bold text-red-400">
                          {arma.Critico_Arma || 20} / x{multCrit}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col rounded-md border border-zinc-800/50 bg-zinc-950/30 p-3">
                      <h4 className="mb-3 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">
                        Dano Médio (Principal)
                      </h4>
                      
                      <div className="mb-2 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span>Normal / Dobro / Triplo</span>
                        </div>
                        <div className="font-display text-xl tracking-wider text-zinc-300">
                          {danoMedioPrincipal.normal} <span className="text-zinc-700">/</span> {danoMedioPrincipal.normal * 2} <span className="text-zinc-700">/</span> {danoMedioPrincipal.normal * 3}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-zinc-800/50 pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400/80">Média Crítica</span>
                        <span className="text-lg font-bold text-red-400/90">{danoMedioPrincipal.critico}</span>
                      </div>

                      {danoMedioSecundario && (
                        <div className="mt-4 flex flex-col border-t border-zinc-800/50 pt-3">
                          <h4 className="mb-2 text-[0.6rem] font-bold uppercase tracking-wider text-zinc-500">
                            Dano Médio (Secundário)
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-zinc-400">
                              {danoMedioSecundario.normal} / {danoMedioSecundario.normal * 2} / {danoMedioSecundario.normal * 3}
                            </span>
                            <span className="text-sm font-bold text-red-400/80" title="Média Crítica Secundária">
                              {danoMedioSecundario.critico}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
          );
        })}
`;

c = c.replace(regexOldMap, newMap);

fs.writeFileSync('src/screens/Ficha/CombatePanel.tsx', c, 'utf8');
