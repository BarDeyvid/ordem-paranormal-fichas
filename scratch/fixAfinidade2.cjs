const fs = require('fs');
let content = fs.readFileSync('src/screens/Ficha/StatusPanel.tsx', 'utf8');

// We just replace the initial condition
content = content.replace(
  `{afinidadeAtiva && afinidadeEscolhida && (`, 
  `{afinidadeEscolhida && (`
);

// We replace the className of the badge
content = content.replace(
  `className="group relative flex h-9 cursor-help items-center justify-center rounded border px-3 text-xs font-bold uppercase tracking-wider text-zinc-100 transition"`,
  `className={\`group relative flex h-9 cursor-help items-center justify-center rounded border px-3 text-xs font-bold uppercase tracking-wider text-zinc-100 transition \${!afinidadeAtiva ? 'opacity-60 saturate-50 border-dashed' : ''}\`}`
);

// We replace the tooltip header
content = content.replace(
  `<strong className="text-zinc-100">Você está conectado à entidade de {afinidadeEscolhida}</strong>`,
  `<strong className={\`\${!afinidadeAtiva ? 'text-zinc-400' : 'text-zinc-100'}\`}>
                    {!afinidadeAtiva ? \`Afinidade Latente com \${afinidadeEscolhida}\` : \`Você está conectado à entidade de \${afinidadeEscolhida}\`}
                  </strong>`
);

// We replace the tooltip body
content = content.replace(
  `<ul className="flex list-disc flex-col gap-2 pl-4">
                  <li>Não precisa de componentes ritualísticos para conjurar rituais deste elemento.</li>
                  <li>Pode aprender rituais que exigem afinidade com este elemento.</li>
                  <li>Recebe +2d20 em testes contra efeitos de {afinidadeEscolhida}. Sofre -2d20 em testes contra efeitos de {obterElementoOpressor(afinidadeEscolhida)}.</li>
                  <li>Pode escolher poderes paranormais deste elemento uma segunda vez para receber o benefício listado na linha "Afinidade".</li>
                </ul>`,
  `{!afinidadeAtiva ? (
                  <p className="text-zinc-400 italic mb-2 mt-2 leading-relaxed">
                    {regras['nex_experiencia'] ? 
                      'A afinidade se manifestará completamente no Nível 12 (NEX 60%), ou se você escolher um poder paranormal deste elemento.' : 
                      'Para despertar sua afinidade, escolha um poder paranormal deste elemento na sua progressão de NEX.'}
                  </p>
                ) : (
                  <ul className="flex list-disc flex-col gap-2 pl-4 mt-2">
                    <li>Não precisa de componentes ritualísticos para conjurar rituais deste elemento.</li>
                    <li>Pode aprender rituais que exigem afinidade com este elemento.</li>
                    <li>Recebe +2d20 em testes contra efeitos de {afinidadeEscolhida}. Sofre -2d20 em testes contra efeitos de {obterElementoOpressor(afinidadeEscolhida)}.</li>
                    <li>Pode escolher poderes paranormais deste elemento uma segunda vez para receber o benefício listado na linha "Afinidade".</li>
                  </ul>
                )}`
);

// We replace the label under the badge
content = content.replace(
  `<span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Afinidade</span>`,
  `<span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {afinidadeAtiva ? 'Afinidade' : 'Afin. (Latente)'}
            </span>`
);


fs.writeFileSync('src/screens/Ficha/StatusPanel.tsx', content);
console.log('Fixed afinidade properly');
