const fs = require('fs');
const p = 'src/components/ModalMudarOrigem.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "import { Collapse } from './Collapse';",
  "import { Collapse } from './Collapse';\nimport { CustomSelect } from './CustomSelect';"
);

c = c.replace(
  "const [escolhasRegra6, setEscolhasRegra6] = useState<Record<number, 'p2' | 'pesp'>>({});",
  "const [escolhasRegra6, setEscolhasRegra6] = useState<Record<number, 'p2' | 'pesp'>>({});\n  const [escolhasElemento, setEscolhasElemento] = useState<Record<number, string>>({});"
);

// We need to disable the Select button in the header if Regra 18 is present and no element is chosen.
// Wait, the select button in the header is for all origins EXCEPT Regra 6.
// Let's modify the header button condition:
// origem.Codigo_Per_Regra !== 6 && origem.Codigo_Regra !== 18
c = c.replace(
  "origem.Codigo_Per_Regra !== 6 && (",
  "origem.Codigo_Per_Regra !== 6 && origem.Codigo_Regra !== 18 && ("
);

// Now the footer selection logic. Currently it has: {origem.Codigo_Per_Regra === 6 && ( ... )}
// Let's append Rule 18 footer logic.
const rule18Footer = `
                    {origem.Codigo_Regra === 18 && (
                      <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
                        <div className="flex gap-4 items-center">
                          <label className="text-sm font-bold text-zinc-300">Escolha o Elemento:</label>
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
                        </div>
                        <button
                          onClick={() => {
                            selecionarOrigem(origem, undefined, escolhasElemento[origem.Codigo_Origem]);
                            onClose();
                          }}
                          disabled={!escolhasElemento[origem.Codigo_Origem]}
                          className={\`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \${!escolhasElemento[origem.Codigo_Origem] ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}\`}
                        >
                          Confirmar Origem
                        </button>
                      </div>
                    )}
`;

c = c.replace(
  "                    {origem.Codigo_Per_Regra === 6 && (",
  rule18Footer + "\n                    {origem.Codigo_Per_Regra === 6 && ("
);

fs.writeFileSync(p, c, 'utf8');
