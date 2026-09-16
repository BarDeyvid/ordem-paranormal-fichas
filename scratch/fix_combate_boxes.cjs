const fs = require('fs');

let c = fs.readFileSync('src/screens/Ficha/CombatePanel.tsx', 'utf8');

const regex = /const ArmaCombateCard: React\.FC<ArmaCombateCardProps> = \(\{[\s\S]*?export const CombatePanel: React\.FC = \(\) => \{/;

const newComponent = `const ArmaCombateCard: React.FC<ArmaCombateCardProps> = ({ armaInv, estaExpandida, toggleExpandir, modificacoesHook, maldicoesHook }) => {
  const [mostrarDanoMedio, setMostrarDanoMedio] = React.useState(false);
  const { arma, modificacoes, maldicoes } = armaInv;
  
  const modsAtivas = (modificacoes || []).map(id => modificacoesHook.modificacoes.find((m: any) => m.Codigo_Modif === id)).filter(Boolean);
  const maldicoesAtivas = (maldicoes || []).map(id => maldicoesHook.maldicoes.find((m: any) => m.Codigo_Modif === id)).filter(Boolean);

  const isPontaria = ['arremesso', 'disparo', 'fogo'].some(t => arma.Tipo_Arma?.toLowerCase().includes(t));
  const pericia = isPontaria ? 'Pontaria' : 'Luta';
  const isAgil = arma['Agil?'] || isPontaria;
  const defaultAtributo = isAgil ? 'AGI' : 'FOR';

  const [atributoDano, setAtributoDano] = React.useState(defaultAtributo);

  const multCrit = arma.Multiplicador_Arma || 2;
  const danoStr = arma.Dano_Arma || '';
  const parsedDano = parseDanoString(danoStr);
  const danoMedioPrincipal = calcularDanoMedio(danoStr, multCrit);
  const danoMedioSecundario = arma.Dano_Secundario ? calcularDanoMedio(arma.Dano_Secundario, multCrit) : null;

  const bonusAtaqueStr = modsAtivas.find((m: any) => m?.Descricao_Modif?.toLowerCase().includes('+2 em testes de ataque')) ? '2' : '0';

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded p-3 hover:border-zinc-700 transition-all flex flex-col">
      {/* CABEÇALHO */}
      <div 
        className="flex items-start justify-between cursor-pointer select-none"
        onClick={toggleExpandir}
      >
        <div className="flex flex-col gap-1">
          <span className="font-bold text-sm text-zinc-200">{arma.Nome_Item}</span>
          <span className="text-xs text-zinc-400">
            <span className="font-bold text-green-400">Dano:</span> {danoStr || '-'} 
            <span className="mx-2 text-zinc-700">|</span>
            <span className="font-bold text-green-400">Crítico:</span> {arma.Critico_Arma || 20}/x{multCrit}
          </span>
        </div>
        <span className={\`text-xs text-zinc-600 transition-transform mt-0.5 \${estaExpandida ? 'rotate-180' : ''}\`}>▼</span>
      </div>

      <Collapse isOpen={estaExpandida}>
        <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-3">
          
          {/* 1. DANO EXPLICADO NO TOPO */}
          {parsedDano.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {parsedDano.map((pd, index) => (
                <div key={index} className="flex-1 min-w-[110px] bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">{pd.label}</span>
                  <span className="text-sm font-bold text-zinc-200">
                    {pd.valor} <span className="text-[0.65rem] font-normal text-zinc-500">({arma.Tipo_Dano_Arma || 'Físico'})</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 2. STATS DA ARMA ESPALHADAS (GRID) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-950/50 rounded px-3 py-2 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Ataque Bônus</span>
              <span className="text-sm font-bold text-zinc-200">{bonusAtaqueStr}</span>
            </div>
            <div className="bg-zinc-950/50 rounded px-3 py-2 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Alcance</span>
              <span className="text-sm font-bold text-zinc-200">{arma.Alcance_Item || 'Curto'}</span>
            </div>
            <div className="bg-zinc-950/50 rounded px-3 py-2 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Perícia</span>
              <span className="text-sm font-bold text-zinc-200">{pericia}</span>
            </div>
            <div className="bg-zinc-950/50 rounded px-3 py-1.5 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Atributo</span>
              <div className="w-24">
                <CustomSelect
                  value={atributoDano}
                  onChange={setAtributoDano}
                  options={ATRIBUTO_OPTIONS}
                  className="!py-0.5 !min-h-0 text-xs"
                  hideIcon={true}
                />
              </div>
            </div>
          </div>

          {/* 3. DANO SECUNDÁRIO E MODIFICAÇÕES */}
          {arma.Dano_Secundario && arma.Dano_Secundario.trim() !== '-' && (
            <div className="bg-zinc-950/50 rounded px-3 py-2 flex justify-between items-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Dano Secundário</span>
              <span className="text-sm font-bold text-zinc-200">{arma.Dano_Secundario}</span>
            </div>
          )}

          {(modsAtivas.length > 0 || maldicoesAtivas.length > 0) && (
            <div className="flex flex-wrap gap-1 mt-1">
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

          {/* 4. MÉDIA DE DANO ESCONDIDA */}
          <button
            onClick={() => setMostrarDanoMedio(!mostrarDanoMedio)}
            className="mt-1 flex w-fit items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            <span className={\`transition-transform \${mostrarDanoMedio ? 'rotate-180' : ''}\`}>▼</span>
            Média de Dano
          </button>
          
          <Collapse isOpen={mostrarDanoMedio}>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Normal (x1 / x2 / x3)</span>
                <span className="text-sm font-bold text-zinc-200">{danoMedioPrincipal.normal} / {danoMedioPrincipal.normal * 2} / {danoMedioPrincipal.normal * 3}</span>
              </div>
              <div className="bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Média Crítica</span>
                <span className="text-sm font-bold text-green-400">{danoMedioPrincipal.critico}</span>
              </div>
            </div>
            {danoMedioSecundario && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Secundária (Normal)</span>
                  <span className="text-sm font-bold text-zinc-200">{danoMedioSecundario.normal} / {danoMedioSecundario.normal * 2} / {danoMedioSecundario.normal * 3}</span>
                </div>
                <div className="bg-zinc-950/50 rounded px-3 py-2 flex flex-col">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">Secundária (Crítica)</span>
                  <span className="text-sm font-bold text-green-400">{danoMedioSecundario.critico}</span>
                </div>
              </div>
            )}
          </Collapse>

        </div>
      </Collapse>
    </div>
  );
};

export const CombatePanel: React.FC = () => {`;

c = c.replace(regex, newComponent);
fs.writeFileSync('src/screens/Ficha/CombatePanel.tsx', c, 'utf8');
