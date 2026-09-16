const fs = require('fs');

let c = fs.readFileSync('src/screens/Ficha/CombatePanel.tsx', 'utf8');

c = c.replace(
  "const armas = armasHook?.armasInventario || [];",
  `const armas = armasHook?.armasInventario || [];

  const armasCorpoACorpo = armas.filter(a => a.arma.Tipo_Arma?.toLowerCase() === 'corpo a corpo' || a.arma.Tipo_Arma?.toLowerCase() === 'corpo-a-corpo');
  const armasFogo = armas.filter(a => a.arma.Tipo_Arma?.toLowerCase() !== 'corpo a corpo' && a.arma.Tipo_Arma?.toLowerCase() !== 'corpo-a-corpo');`
);

// We need a helper function to render a weapon list so we can call it twice
const renderWeaponListStr = `
  const renderWeaponList = (lista: ArmaInventario[], titulo: string) => {
    if (lista.length === 0) return null;
    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-sm border-b border-zinc-800 pb-1 mt-2">{titulo}</h3>
        {lista.map((armaInv: ArmaInventario) => {
          const { arma, modificacoes, maldicoes } = armaInv;
          
          const modsAtivas = (modificacoes || []).map(id => modificacoesHook.modificacoes.find(m => m.Codigo_Modif === id)).filter(Boolean);
          const maldicoesAtivas = (maldicoes || []).map(id => maldicoesHook.maldicoes.find(m => m.Codigo_Modif === id)).filter(Boolean);

          const bonusAtaqueStr = modsAtivas.find(m => m?.Descricao_Modif?.toLowerCase().includes('+2 em testes de ataque')) 
            ? '+2' : null;

          const multCrit = arma.Multiplicador_Arma || 2;
          const danoMedioPrincipal = calcularDanoMedio(arma.Dano_Arma, multCrit);
          const danoMedioSecundario = arma.Dano_Secundario ? calcularDanoMedio(arma.Dano_Secundario, multCrit) : null;

          return (
            <div key={armaInv.id} className="flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 py-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg tracking-wide text-zinc-100">{arma.Nome_Item}</h3>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-zinc-400">
                      {arma.Tipo_Dano_Arma || 'Físico'}
                    </span>
                  </div>
                  {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
                    <div className="flex flex-wrap gap-1">
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

                {bonusAtaqueStr && (
                  <div className="flex flex-col items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-center">
                    <span className="text-[0.6rem] font-bold uppercase tracking-wider text-zinc-400">Ataque</span>
                    <span className="text-sm font-bold text-zinc-200">{bonusAtaqueStr}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
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
          );
        })}
      </div>
    );
  };
`;

const oldReturn = /return \(\s*<div className="flex flex-col gap-4 p-2">[\s\S]*?\n\s*\);\n};/;

const newReturn = `${renderWeaponListStr}
  return (
    <div className="flex flex-col gap-6 p-2">
      {renderWeaponList(armasCorpoACorpo, 'Armas Corpo a Corpo')}
      {renderWeaponList(armasFogo, 'Armas de Fogo e Disparo')}
    </div>
  );
};`;

c = c.replace(oldReturn, newReturn);

fs.writeFileSync('src/screens/Ficha/CombatePanel.tsx', c, 'utf8');
