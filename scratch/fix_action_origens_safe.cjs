const fs = require('fs');

const p = 'src/screens/OrigensScreen.tsx';
let lines = fs.readFileSync(p, 'utf8').split('\n');

// Find the line that has: {origem.Codigo_Per_Regra === 6 && estaExpandida ? (
const startIdx = lines.findIndex(l => l.includes('{origem.Codigo_Per_Regra === 6 && estaExpandida ? ('));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('Escolher') && lines[i+1].includes('</button>'));

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = `                {origem.Codigo_Per_Regra === 6 && estaExpandida ? (
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
  
  lines.splice(startIdx, endIdx - startIdx + 2, newBlock);
}

// Add state
const stateIdx = lines.findIndex(l => l.includes("const [escolhasRegra6, setEscolhasRegra6] = React.useState<Record<number, 'p2' | 'pesp'>>({});"));
if (stateIdx !== -1) {
  lines.splice(stateIdx + 1, 0, "  const [escolhendoElementoPara, setEscolhendoElementoPara] = React.useState<number | null>(null);");
}

fs.writeFileSync(p, lines.join('\n'), 'utf8');
