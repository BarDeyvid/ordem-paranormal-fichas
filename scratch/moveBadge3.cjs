const fs = require('fs');
let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');

const collapseRegex = /<Collapse isOpen=\{estaExpandida\}>\s*<div className="px-4 py-4 text-left text-sm leading-relaxed text-zinc-400">/;
                              
const collapseReplace = `<Collapse isOpen={estaExpandida}>
                              <div className="px-4 py-4 text-left text-sm leading-relaxed text-zinc-400">
                                {hab.automatico && (
                                  <div className="mb-3 flex items-center gap-2 border-b border-zinc-800/50 pb-2">
                                    <span
                                      title={hab.automatico.toLowerCase().trim() === 'sim' ? 'Totalmente automático' : 'Semi-automático'}
                                      className={\`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider \${
                                        hab.automatico.toLowerCase().trim() === 'sim'
                                          ? 'bg-green-950/60 text-green-400 border border-green-800/50'
                                          : 'bg-yellow-950/60 text-yellow-400 border border-yellow-800/50'
                                      }\`}
                                    >
                                      {hab.automatico.toLowerCase().trim() === 'sim' ? (
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
                                    <span className="text-[10px] text-zinc-500 italic">
                                      {hab.automatico.toLowerCase().trim() === 'sim' 
                                        ? 'Os bônus deste poder já estão aplicados na sua ficha.' 
                                        : 'Os bônus deste poder são condicionais ou necessitam de ativação manual.'}
                                    </span>
                                  </div>
                                )}`;

if (collapseRegex.test(content)) {
  content = content.replace(collapseRegex, collapseReplace);
  fs.writeFileSync('src/screens/Ficha/AbasPanel.tsx', content);
  console.log('Fixed auto badge inside Collapse');
} else {
  console.log('Failed to find collapse marker via regex');
}
