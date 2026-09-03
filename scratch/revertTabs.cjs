const fs = require('fs');

function revertModalRituaisTabs() {
  const file = 'src/components/ModalRituais.tsx';
  let content = fs.readFileSync(file, 'utf8');

  const regex = /\{\/\* FILTROS \(Abas Principais - Elementos\) \*\/\}[\s\S]*?(?=\{\/\* FILTROS \(Abas Secundárias - Círculos\))/;
  const match = content.match(regex);
  if (!match) {
    console.log("Could not find block in " + file);
    return;
  }

  const oldBlock = `{/* FILTROS (Abas Principais - Elementos) */}
        <div className="flex flex-wrap border-b border-zinc-800 bg-zinc-950">
          <button
            onClick={() => setAbaElemento(null)}
            className={\`min-w-[70px] flex-1 px-1 py-2.5 text-xs font-bold uppercase tracking-wider transition \${
              abaElemento === null
                ? 'border-b-2 border-green-900 bg-zinc-900 text-zinc-100'
                : 'border-b-2 border-transparent text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
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
                className={\`min-w-[70px] flex-1 px-1 py-2.5 text-xs font-bold uppercase tracking-wider transition \${
                  ativo
                    ? 'border-b-2 bg-zinc-900 text-zinc-100'
                    : 'border-b-2 border-transparent text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
                }\`}
                style={{
                  borderBottomColor: ativo ? (CORES_ELEMENTOS[elem.toLowerCase()] || '#888') : 'transparent',
                }}
              >
                {elem}
              </button>
            );
          })}
        </div>

        `;

  content = content.replace(regex, oldBlock);
  fs.writeFileSync(file, content);
  console.log("Reverted ModalRituais.tsx tabs");
}

function revertModalRituaisExtraTabs() {
  const file = 'src/components/ModalRituaisExtra.tsx';
  let content = fs.readFileSync(file, 'utf8');

  const regex = /\{elementos\.map\(elem => \{[\s\S]*?\}\)\}/;
  const match = content.match(regex);
  if (!match) {
    console.log("Could not find block in " + file);
    return;
  }

  const oldBlock = `{elementos.map(elem => {
              const ativo = abaElemento === elem;
              return (
                <button
                  key={elem}
                  onClick={() => setAbaElemento(elem)}
                  className={\`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition border \${
                    ativo
                      ? 'border-zinc-600 text-zinc-100'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }\`}
                  style={{
                    backgroundColor: ativo ? obterCorBadge(elem) : 'transparent',
                    color: ativo ? obterCorTexto(elem) : undefined,
                  }}
                >
                  {elem}
                </button>
              );
            })}`;

  content = content.replace(regex, oldBlock);
  fs.writeFileSync(file, content);
  console.log("Reverted ModalRituaisExtra.tsx tabs");
}

revertModalRituaisTabs();
revertModalRituaisExtraTabs();
