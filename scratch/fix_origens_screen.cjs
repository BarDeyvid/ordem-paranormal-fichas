const fs = require('fs');
const p = 'src/screens/OrigensScreen.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "import { Collapse } from '../components/Collapse';",
  "import { Collapse } from '../components/Collapse';\nimport { CustomSelect } from '../components/CustomSelect';"
);

c = c.replace(
  "const [escolhasRegra6, setEscolhasRegra6] = React.useState<Record<number, 'p2' | 'pesp'>>({});",
  "const [escolhasRegra6, setEscolhasRegra6] = React.useState<Record<number, 'p2' | 'pesp'>>({});\n  const [escolhasElemento, setEscolhasElemento] = React.useState<Record<number, string>>({});"
);

// We need to disable the header "Escolher" button if Rule 18 is active but no element is chosen, OR if Rule 6 is active and no choice is made.
// Currently:
// disabled={origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]}
// Change to:
// disabled={(origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]) || (origem.Codigo_Regra === 18 && !escolhasElemento[origem.Codigo_Origem])}

c = c.replace(
  /disabled=\{origem\.Codigo_Per_Regra === 6 && !escolhasRegra6\[origem\.Codigo_Origem\]\}/g,
  "disabled={(origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]) || (origem.Codigo_Regra === 18 && !escolhasElemento[origem.Codigo_Origem])}"
);

// We also need to change the condition that hides the header "Escolher" button.
// Currently: 
// {origem.Codigo_Per_Regra === 6 && estaExpandida ? (
// Change to:
// {(origem.Codigo_Per_Regra === 6 || origem.Codigo_Regra === 18) && estaExpandida ? (

c = c.replace(
  /\{origem\.Codigo_Per_Regra === 6 && estaExpandida \? \(/g,
  "{(origem.Codigo_Per_Regra === 6 || origem.Codigo_Regra === 18) && estaExpandida ? ("
);

// Also the "Escolher" action:
// selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2');
// Change to:
// selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2', escolhasElemento[origem.Codigo_Origem]);

c = c.replace(
  /selecionarOrigem\(origem, escolhasRegra6\[origem\.Codigo_Origem\] \|\| 'p2'\);/g,
  "selecionarOrigem(origem, escolhasRegra6[origem.Codigo_Origem] || 'p2', escolhasElemento[origem.Codigo_Origem]);"
);

// Also the instruction text:
// <span className="text-xs text-zinc-400">Escolha uma perícia abaixo primeiro</span>
// Change to:
// <span className="text-xs text-zinc-400">Preencha as opções abaixo primeiro</span>

c = c.replace(
  /<span className="text-xs text-zinc-400">Escolha uma perícia abaixo primeiro<\/span>/g,
  '<span className="text-xs text-zinc-400">Preencha as opções abaixo primeiro</span>'
);

// Also the button classes:
// className={\`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \${origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem] ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}\`}
c = c.replace(
  /className=\{`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \$\{origem\.Codigo_Per_Regra === 6 && !escolhasRegra6\[origem\.Codigo_Origem\] \? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'\}`\}/g,
  "className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-100 transition ${((origem.Codigo_Per_Regra === 6 && !escolhasRegra6[origem.Codigo_Origem]) || (origem.Codigo_Regra === 18 && !escolhasElemento[origem.Codigo_Origem])) ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}`}"
);

// Finally, append the Rule 18 selector block inside the expanded section.
// The easiest place is right after:
//                   {origem.Nome_Poder && (
//                     <div className="mt-4">
//                       <strong className="text-zinc-200 block mb-1">Poder da Origem: {origem.Nome_Poder}</strong>
//                       <p>{origem.Descricao_Poder}</p>
//                     </div>
//                   )}

const rule18Block = `
                  {origem.Codigo_Regra === 18 && (
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
                  )}
`;

// It has: 
//                   {origem.Nome_Poder && (
//                     <div className="mt-4">
//                       <strong className="text-zinc-200 block mb-1">Poder: {origem.Nome_Poder}</strong>
//                       <p>{origem.Descricao_Poder}</p>
//                     </div>
//                   )}
// Oh wait, in OrigensScreen it's:
//                   {origem.Nome_Poder && (
//                     <div className="mt-4">
//                       <strong className="text-zinc-200 block mb-1">Poder: {origem.Nome_Poder}</strong>
//                       <p>{origem.Descricao_Poder}</p>
//                     </div>
//                   )}

// Let's just append it after Rule 6 block:
c = c.replace(
  /<\/Collapse>/g,
  rule18Block + "\n              </Collapse>"
);


fs.writeFileSync(p, c, 'utf8');
