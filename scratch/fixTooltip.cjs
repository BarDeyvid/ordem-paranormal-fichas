const fs = require('fs');
let content = fs.readFileSync('src/screens/Ficha/StatusPanel.tsx', 'utf8');

const search = `<ul className="flex list-disc flex-col gap-2 pl-4">
                  <li>Não precisa de componentes ritualísticos para conjurar rituais deste elemento.</li>
                  <li>Pode aprender rituais que exigem afinidade com este elemento.</li>
                  <li>Recebe +2d20 em testes contra efeitos de {afinidadeEscolhida}. Sofre -2d20 em testes contra efeitos de {obterElementoOpressor(afinidadeEscolhida)}.</li>
                  <li>Pode escolher poderes paranormais deste elemento uma segunda vez para receber o benefício listado na linha "Afinidade".</li>
                </ul>`;

const replace = `{!afinidadeAtiva ? (
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
                )}`;

content = content.replace(search, replace);
fs.writeFileSync('src/screens/Ficha/StatusPanel.tsx', content);
console.log('Fixed tooltip body');
