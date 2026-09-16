const fs = require('fs');
let c = fs.readFileSync('src/screens/OrigensScreen.tsx', 'utf8');

const oldAction = `                {(origem.Codigo_Per_Regra === 6 || origem.Codigo_Regra === 18) && estaExpandida ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">Preencha as opções abaixo primeiro</span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2', escolhasElemento[origem.Codigo_Origem]);
                      setTelaAtual('classe');
                    }}
                    disabled={(origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]) || (origem.Codigo_Regra === 18 && !escolhasElemento[origem.Codigo_Origem])}
                    className={\`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \${((origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]) || (origem.Codigo_Regra === 18 && !escolhasElemento[origem.Codigo_Origem])) ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}\`}
                  >
                    Escolher
                  </button>
                )}`;

const newAction = `                {origem.Codigo_Per_Regra === 6 && estaExpandida ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">Escolha uma perícia abaixo primeiro</span>
                  </div>
                ) : escolhendoElementoPara === origem.Codigo_Origem ? (
                  <div className="flex flex-wrap gap-1 items-center bg-zinc-950 p-1.5 rounded border border-zinc-800">
                    <span className="text-[0.55rem] text-zinc-500 uppercase font-bold px-1 hidden sm:inline">Elemento:</span>
                    {['Sangue', 'Morte', 'Conhecimento', 'Energia'].map(elem => {
                      return (
                        <button
                          key={elem}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setEscolhendoElementoPara(null); 
                            selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2', elem);
                            setTelaAtual('classe');
                          }}
                          className={\`rounded px-1.5 py-0.5 text-[0.55rem] font-bold uppercase transition border border-zinc-700 hover:scale-105 \${
                            elem === 'Sangue' ? 'text-red-500 bg-transparent' :
                            elem === 'Morte' ? 'bg-black/50 text-white px-2' :
                            elem === 'Conhecimento' ? 'text-yellow-500 bg-transparent' :
                            'text-purple-500 bg-transparent'
                          }\`}
                        >
                          {elem}
                        </button>
                      );
                    })}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEscolhendoElementoPara(null); }}
                      className="rounded px-2 py-0.5 text-[0.55rem] font-bold uppercase transition border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (origem.Codigo_Regra === 18) {
                        setEscolhendoElementoPara(origem.Codigo_Origem);
                        return;
                      }
                      selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2');
                      setTelaAtual('classe');
                    }}
                    disabled={origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]}
                    className={\`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \${(origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]) ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}\`}
                  >
                    Escolher
                  </button>
                )}`;

c = c.replace(oldAction, newAction);

// Remove the block at the bottom
const rule18Block = `                  {origem.Codigo_Regra === 18 && (
                    <div className="mt-4 flex flex-col gap-2 rounded-md border border-zinc-700 bg-zinc-800 p-4">
                      <strong className="text-zinc-200 block">Escolha o Elemento da Afinidade</strong>
                      <CustomSelect
                        value={escolhasElemento[origem.Codigo_Origem] || ''}
                        onChange={(val) => setEscolhasElemento(prev => ({ ...prev, [origem.Codigo_Origem]: val }))}
                        options={[
                          { value: '', label: 'Selecione...' },
                          { value: 'Sangue', label: 'Sangue' },
                          { value: 'Morte', label: 'Morte' },
                          { value: 'Conhecimento', label: 'Conhecimento' },
                          { value: 'Energia', label: 'Energia' }
                        ]}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2', escolhasElemento[origem.Codigo_Origem]);
                          setTelaAtual('classe');
                        }}
                        disabled={!escolhasElemento[origem.Codigo_Origem]}
                        className={\`mt-2 self-start rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \${!escolhasElemento[origem.Codigo_Origem] ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}\`}
                      >
                        Confirmar Origem
                      </button>
                    </div>
                  )}`;
c = c.replace(rule18Block, '');

// Also remove CustomSelect import if not used elsewhere
c = c.replace("import { CustomSelect } from '../components/CustomSelect';\n", "");

// Replace escolhasElemento state with escolhendoElementoPara
c = c.replace(
  "const [escolhasElemento, setEscolhasElemento] = React.useState<Record<number, string>>({});",
  "const [escolhendoElementoPara, setEscolhendoElementoPara] = React.useState<number | null>(null);"
);

fs.writeFileSync('src/screens/OrigensScreen.tsx', c, 'utf8');
