const fs = require('fs');

let content = fs.readFileSync('src/components/ModalPoderesExtra.tsx', 'utf8');

const oldLogic = "const count = contextoPrereq ? contextoPrereq.poderes.filter(p => p.nome === poder.Nome.toLowerCase()).length : 0;";
const newLogic = `const count = contextoPrereq ? contextoPrereq.poderes.filter(p => p.nome === poder.Nome.toLowerCase()).length : 0;
            const automaticoVal = ehParanormal 
              ? (count >= 1 ? (poder['Automatico?_Afinidade'] ?? poder['Automatico?']) : poder['Automatico?'])
              : poder.Automatico;`;
content = content.replace(oldLogic, newLogic);

const oldRender = '<span className="font-bold text-zinc-200 group-hover:text-green-400 transition select-none truncate">{poder.Nome}</span>';
const newRender = `<span className="font-bold text-zinc-200 group-hover:text-green-400 transition select-none truncate">{poder.Nome}</span>
                    {automaticoVal && (
                      <span
                        title={automaticoVal === 'Sim' ? 'Totalmente automático — acontece sozinho' : 'Semi-automático — parte funciona automaticamente'}
                        className={\`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider \${
                          automaticoVal === 'Sim'
                            ? 'bg-green-950/60 text-green-400 border border-green-800/50'
                            : 'bg-yellow-950/60 text-yellow-400 border border-yellow-800/50'
                        }\`}
                      >
                        {automaticoVal === 'Sim' ? (
                          <>
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/></svg>
                            Auto
                          </>
                        ) : (
                          <>
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" opacity="0.5"/><path d="M19 3v4m0 4v10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                            Semi
                          </>
                        )}
                      </span>
                    )}`;
content = content.replace(oldRender, newRender);

fs.writeFileSync('src/components/ModalPoderesExtra.tsx', content);
