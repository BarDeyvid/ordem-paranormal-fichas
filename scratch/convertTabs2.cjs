const fs = require('fs');

function convertTabs(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  const regex = /\{\/\* FILTROS \(Abas Principais - Elementos\) \*\/\}[\s\S]*?(?=\{\/\* FILTROS \(Abas Secundárias - Círculos\))/;
  const match = content.match(regex);
  if (!match) {
    console.log("Could not find block in " + file);
    return;
  }
  
  const newBlock = `{/* FILTROS (Abas Principais - Elementos) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Elementos:</span>
          <button
            onClick={() => setAbaElemento(null)}
            className={\`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition border \${
              abaElemento === null
                ? 'bg-green-900/40 text-green-300 border-green-800'
                : 'bg-zinc-800/60 text-zinc-500 border-zinc-700 hover:text-zinc-300'
            }\`}
          >
            Todos
          </button>
          {['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo'].map(elem => {
            const ativo = abaElemento === elem;
            return (
              <button
                key={elem}
                onClick={() => setAbaElemento(elem)}
                className={\`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition border \${
                  ativo
                    ? (() => {
                        const elStr = elem.toLowerCase();
                        if (elStr.includes('medo')) return 'border-zinc-500 bg-zinc-200/80 text-zinc-950 px-3';
                        if (elStr.includes('sangue')) return 'border-red-900 bg-red-950/20 text-red-500';
                        if (elStr.includes('morte')) return 'border-zinc-700 bg-black/50 text-white px-3';
                        if (elStr.includes('conhecimento')) return 'border-yellow-900 bg-yellow-950/20 text-yellow-500';
                        if (elStr.includes('energia')) return 'border-purple-900 bg-purple-950/20 text-purple-500';
                        return 'border-zinc-600 text-zinc-100';
                      })()
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }\`}
              >
                {elem}
              </button>
            );
          })}
        </div>
        
        `;

  content = content.replace(regex, newBlock);
  fs.writeFileSync(file, content);
  console.log(`Replaced Element tabs in ${file}`);
}

convertTabs('src/components/ModalRituais.tsx');
convertTabs('src/components/ModalRituaisExtra.tsx');
