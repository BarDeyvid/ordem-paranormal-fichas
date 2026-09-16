const fs = require('fs');

let c = fs.readFileSync('src/screens/Ficha/CombatePanel.tsx', 'utf8');

const regex = /const ArmaCombateCard: React\.FC<ArmaCombateCardProps> = \(\{[\s\S]*?export const CombatePanel: React\.FC = \(\) => \{/;

const newComponent = `const ArmaCombateCard: React.FC<ArmaCombateCardProps> = ({ armaInv, estaExpandida, toggleExpandir, modificacoesHook, maldicoesHook }) => {
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
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded p-3 hover:border-green-500/50 hover:bg-zinc-900/80 group flex flex-col transition-all">
      <div 
        className="flex items-start justify-between gap-3 cursor-pointer select-none"
        onClick={toggleExpandir}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-sm text-zinc-200 group-hover:text-green-400 transition">{arma.Nome_Item}</span>
          {bonusAtaqueStr && (
            <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider bg-green-950/60 text-green-400 border border-green-800/50">
              Ataque {bonusAtaqueStr}
            </span>
          )}
        </div>
        <span className={\`text-xs text-zinc-600 transition-transform mt-0.5 \${estaExpandida ? 'rotate-180' : ''}\`}>▼</span>
      </div>

      <Collapse isOpen={estaExpandida}>
        <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-1.5">
          {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
            <div className="flex flex-wrap gap-1 mb-1.5">
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
          
          <p className="text-xs text-zinc-300">
            <span className="text-zinc-500 font-bold uppercase text-[0.6rem] tracking-wider mr-1">Tipo:</span> 
            {arma.Tipo_Dano_Arma || 'Físico'}
          </p>
          <p className="text-xs text-zinc-300">
            <span className="text-zinc-500 font-bold uppercase text-[0.6rem] tracking-wider mr-1">Dano Base:</span> 
            {arma.Dano_Arma}
          </p>
          {arma.Dano_Secundario && arma.Dano_Secundario.trim() !== '-' && (
            <p className="text-xs text-zinc-300">
              <span className="text-zinc-500 font-bold uppercase text-[0.6rem] tracking-wider mr-1">Dano Sec.:</span> 
              {arma.Dano_Secundario}
            </p>
          )}
          <p className="text-xs text-zinc-300">
            <span className="text-zinc-500 font-bold uppercase text-[0.6rem] tracking-wider mr-1">Crítico:</span> 
            {arma.Critico_Arma || 20} / x{multCrit}
          </p>

          <button
            onClick={() => setMostrarDanoMedio(!mostrarDanoMedio)}
            className="mt-2 text-[0.65rem] text-zinc-500 hover:text-zinc-300 underline text-left w-fit"
          >
            {mostrarDanoMedio ? 'Ocultar Média de Dano' : 'Mostrar Média de Dano'}
          </button>

          <Collapse isOpen={mostrarDanoMedio}>
            <div className="mt-2 pl-3 border-l-2 border-zinc-800 flex flex-col gap-1.5">
              <p className="text-[0.65rem] text-zinc-400">
                <span className="font-bold mr-1">Média Normal (x1 / x2 / x3):</span> 
                {danoMedioPrincipal.normal} / {danoMedioPrincipal.normal * 2} / {danoMedioPrincipal.normal * 3}
              </p>
              <p className="text-[0.65rem] text-zinc-400">
                <span className="font-bold mr-1">Média Crítica:</span> 
                {danoMedioPrincipal.critico}
              </p>
              
              {danoMedioSecundario && (
                <div className="mt-1 pt-1 border-t border-zinc-800/50 flex flex-col gap-1.5">
                  <p className="text-[0.65rem] text-zinc-400">
                    <span className="font-bold mr-1">Secundária (x1 / x2 / x3):</span> 
                    {danoMedioSecundario.normal} / {danoMedioSecundario.normal * 2} / {danoMedioSecundario.normal * 3}
                  </p>
                  <p className="text-[0.65rem] text-zinc-400">
                    <span className="font-bold mr-1">Crítica Secundária:</span> 
                    {danoMedioSecundario.critico}
                  </p>
                </div>
              )}
            </div>
          </Collapse>
        </div>
      </Collapse>
    </div>
  );
};

export const CombatePanel: React.FC = () => {`;

c = c.replace(regex, newComponent);

fs.writeFileSync('src/screens/Ficha/CombatePanel.tsx', c, 'utf8');
