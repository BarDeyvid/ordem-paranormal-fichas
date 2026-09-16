const fs = require('fs');

let c = fs.readFileSync('src/screens/Ficha/CombatePanel.tsx', 'utf8');

const regexMap = /\{lista\.map\(\(armaInv: ArmaInventario\) => \{[\s\S]*?\n\s*\}\)\}/;

const newMap = `{lista.map((armaInv: ArmaInventario) => (
          <ArmaCombateCard 
            key={armaInv.id} 
            armaInv={armaInv} 
            estaExpandida={!!expandidos[armaInv.id]} 
            toggleExpandir={() => toggleExpandir(armaInv.id)} 
            modificacoesHook={modificacoesHook}
            maldicoesHook={maldicoesHook}
          />
        ))}`;

c = c.replace(regexMap, newMap);

const newComponent = `
interface ArmaCombateCardProps {
  armaInv: ArmaInventario;
  estaExpandida: boolean;
  toggleExpandir: () => void;
  modificacoesHook: any;
  maldicoesHook: any;
}

const ArmaCombateCard: React.FC<ArmaCombateCardProps> = ({ armaInv, estaExpandida, toggleExpandir, modificacoesHook, maldicoesHook }) => {
  const [mostrarDanoMedio, setMostrarDanoMedio] = React.useState(false);
  const { arma, modificacoes, maldicoes } = armaInv;
  
  const modsAtivas = (modificacoes || []).map(id => modificacoesHook.modificacoes.find((m: any) => m.Codigo_Modif === id)).filter(Boolean);
  const maldicoesAtivas = (maldicoes || []).map(id => maldicoesHook.maldicoes.find((m: any) => m.Codigo_Modif === id)).filter(Boolean);

  const bonusAtaqueStr = modsAtivas.find((m: any) => m?.Descricao_Modif?.toLowerCase().includes('+2 em testes de ataque')) 
    ? '+2' : null;

  const multCrit = arma.Multiplicador_Arma || 2;
  const danoMedioPrincipal = calcularDanoMedio(arma.Dano_Arma, multCrit);
  const danoMedioSecundario = arma.Dano_Secundario ? calcularDanoMedio(arma.Dano_Secundario, multCrit) : null;

  return (
    <div
      className="overflow-hidden rounded-r-lg border-l-4 border-green-800 bg-zinc-900/60 transition hover:bg-zinc-900"
    >
      {/* CABEÇALHO (CLICÁVEL) */}
      <div 
        className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"
        onClick={toggleExpandir}
      >
        <div className="flex flex-1 items-center gap-3">
          <span className={\`text-xs text-zinc-600 transition-transform \${estaExpandida ? 'rotate-180' : ''}\`}>▼</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-100">{arma.Nome_Item}</span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-zinc-400">
                {arma.Tipo_Dano_Arma || 'Físico'}
              </span>
            </div>
            {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
              <div className="mt-1 flex flex-wrap gap-1">
                {modsAtivas.map((m: any) => (
                  <span key={m!.Codigo_Modif} className="rounded border border-zinc-700 bg-zinc-800/50 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-zinc-300">
                    {m!.Nome_Modificacao}
                  </span>
                ))}
                {maldicoesAtivas.map((m: any) => (
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
          <div className="flex flex-col gap-3">
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
              <span className="text-sm font-bold text-zinc-200">
                {arma.Critico_Arma || 20} / x{multCrit}
              </span>
            </div>

            {/* BOTÃO PARA MOSTRAR DANO MÉDIO */}
            <button
              onClick={() => setMostrarDanoMedio(!mostrarDanoMedio)}
              className="mt-2 flex w-fit items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:bg-zinc-700 hover:text-zinc-200"
            >
              <span className={\`transition-transform \${mostrarDanoMedio ? 'rotate-180' : ''}\`}>▼</span>
              Média de Dano
            </button>

            <Collapse isOpen={mostrarDanoMedio}>
              <div className="mt-2 flex flex-col rounded-md border border-zinc-800/50 bg-zinc-950/30 p-4">
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

                <div className="mt-2 flex items-center justify-between border-t border-zinc-800/50 pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Média Crítica</span>
                  <span className="text-lg font-bold text-zinc-200">{danoMedioPrincipal.critico}</span>
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
                      <span className="text-sm font-bold text-zinc-200" title="Média Crítica Secundária">
                        {danoMedioSecundario.critico}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Collapse>
          </div>
        </div>
      </Collapse>
    </div>
  );
};
`;

c = c.replace(
  "export const CombatePanel: React.FC = () => {",
  newComponent + "\nexport const CombatePanel: React.FC = () => {"
);

fs.writeFileSync('src/screens/Ficha/CombatePanel.tsx', c, 'utf8');
