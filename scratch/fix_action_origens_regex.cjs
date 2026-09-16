const fs = require('fs');
let c = fs.readFileSync('src/screens/OrigensScreen.tsx', 'utf8');

c = c.replace(
  "import { CustomSelect } from '../components/CustomSelect';\n",
  ""
);

c = c.replace(
  "const [escolhasElemento, setEscolhasElemento] = React.useState<Record<number, string>>({});",
  "const [escolhendoElementoPara, setEscolhendoElementoPara] = React.useState<number | null>(null);"
);

// We need to match the action block using a simpler regex.
// Find from: `                {(origem.Codigo_Per_Regra === 6 || origem.Codigo_Regra === 18) && estaExpandida ? (`
// To: `                  </button>\n                )}`
const regex = /\{\(origem\.Codigo_Per_Regra === 6 \|\| origem\.Codigo_Regra === 18\) && estaExpandida \? \([\s\S]*?<\/button>\s*\)\}/;

const newAction = `{origem.Codigo_Per_Regra === 6 && estaExpandida ? (
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

c = c.replace(regex, newAction);

const regexFooter = /\{origem\.Codigo_Regra === 18 && \([\s\S]*?Confirmar Origem\s*<\/button>\s*<\/div>\s*\)\}/;
c = c.replace(regexFooter, "");

fs.writeFileSync('src/screens/OrigensScreen.tsx', c, 'utf8');
