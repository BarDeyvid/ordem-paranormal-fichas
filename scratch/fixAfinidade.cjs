const fs = require('fs');
let content = fs.readFileSync('src/screens/Ficha/StatusPanel.tsx', 'utf8');

const search = `{afinidadeAtiva && afinidadeEscolhida && (
          <div className="flex flex-col items-center gap-1.5">
            <div 
              className="group relative flex h-9 cursor-help items-center justify-center rounded border px-3 text-xs font-bold uppercase tracking-wider text-zinc-100 transition"
              style={{
                borderColor: CORES_ELEMENTOS[afinidadeEscolhida.toLowerCase()] || '#888',
                backgroundColor: \`\${CORES_ELEMENTOS[afinidadeEscolhida.toLowerCase()] || '#888'}40\`,
                color: '#ffffff'
              }}
            >
              {afinidadeEscolhida}
              <button 
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-400 opacity-0 transition hover:bg-green-900 hover:text-white group-hover:opacity-100"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setAfinidadeEscolhida(null); 
                  const nexElementais = [60, 75, 90];
                  nexElementais.forEach(n => {
                    const chave = n + 1000;
                    if (poderesHook.poderesEscolhidos[chave]) {
                      poderesHook.removerPoder(chave);
                    }
                  });
                }}
                title="Trocar Afinidade"
              >
                &#8634;
              </button>
              {/* TOOLTIP */}
              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded border border-zinc-700 bg-zinc-950 p-3 text-left text-xs font-normal text-zinc-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                <div className="mb-2 border-b border-zinc-800 pb-2">
                  <strong className="text-zinc-100">Você está conectado à entidade de {afinidadeEscolhida}</strong>
                </div>
                <ul className="flex list-disc flex-col gap-2 pl-4">
                  <li>Não precisa de componentes ritualísticos para conjurar rituais deste elemento.</li>
                  <li>Pode aprender rituais que exigem afinidade com este elemento.</li>
                  <li>Recebe +2d20 em testes contra efeitos de {afinidadeEscolhida}. Sofre -2d20 em testes contra efeitos de {obterElementoOpressor(afinidadeEscolhida)}.</li>
                  <li>Pode escolher poderes paranormais deste elemento uma segunda vez para receber o benefício listado na linha "Afinidade".</li>
                </ul>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Afinidade</span>
          </div>
        )}`;

const replace = `{afinidadeEscolhida && (
          <div className="flex flex-col items-center gap-1.5">
            <div 
              className={\`group relative flex h-9 cursor-help items-center justify-center rounded border px-3 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \${!afinidadeAtiva ? 'opacity-60 saturate-50 border-dashed' : ''}\`}
              style={{
                borderColor: CORES_ELEMENTOS[afinidadeEscolhida.toLowerCase()] || '#888',
                backgroundColor: \`\${CORES_ELEMENTOS[afinidadeEscolhida.toLowerCase()] || '#888'}40\`,
                color: '#ffffff'
              }}
            >
              {afinidadeEscolhida}
              <button 
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-400 opacity-0 transition hover:bg-green-900 hover:text-white group-hover:opacity-100"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setAfinidadeEscolhida(null); 
                  const nexElementais = [60, 75, 90];
                  nexElementais.forEach(n => {
                    const chave = n + 1000;
                    if (poderesHook.poderesEscolhidos[chave]) {
                      poderesHook.removerPoder(chave);
                    }
                  });
                }}
                title="Trocar Afinidade"
              >
                &#8634;
              </button>
              {/* TOOLTIP */}
              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded border border-zinc-700 bg-zinc-950 p-3 text-left text-xs font-normal text-zinc-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                <div className="mb-2 border-b border-zinc-800 pb-2">
                  <strong className={\`\${!afinidadeAtiva ? 'text-zinc-400' : 'text-zinc-100'}\`}>
                    {!afinidadeAtiva ? \`Afinidade Latente com \${afinidadeEscolhida}\` : \`Você está conectado à entidade de \${afinidadeEscolhida}\`}
                  </strong>
                </div>
                {!afinidadeAtiva ? (
                  <p className="text-zinc-400 italic mb-2">
                    {regras['nex_experiencia'] ? 
                      'A afinidade se manifestará completamente no Nível 12 (NEX 60%), ou se você escolher um poder paranormal deste elemento.' : 
                      'Para despertar sua afinidade, escolha um poder paranormal deste elemento na sua progressão de NEX.'}
                  </p>
                ) : (
                  <ul className="flex list-disc flex-col gap-2 pl-4">
                    <li>Não precisa de componentes ritualísticos para conjurar rituais deste elemento.</li>
                    <li>Pode aprender rituais que exigem afinidade com este elemento.</li>
                    <li>Recebe +2d20 em testes contra efeitos de {afinidadeEscolhida}. Sofre -2d20 em testes contra efeitos de {obterElementoOpressor(afinidadeEscolhida)}.</li>
                    <li>Pode escolher poderes paranormais deste elemento uma segunda vez para receber o benefício listado na linha "Afinidade".</li>
                  </ul>
                )}
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {afinidadeAtiva ? 'Afinidade' : 'Afin. (Latente)'}
            </span>
          </div>
        )}`;

if (content.includes('afinidadeAtiva && afinidadeEscolhida')) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/screens/Ficha/StatusPanel.tsx', content);
  console.log('Fixed afinidade visibility');
} else {
  console.log('Not found');
}
