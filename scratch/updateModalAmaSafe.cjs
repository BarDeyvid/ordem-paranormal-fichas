const fs = require('fs');

const file = 'src/screens/Ficha/ModalItensAmaldicoados.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('poderesHook, trilhasHook, nex')) {
  content = content.replace(
    'const { itensAmaldicoadosHook } = useRPG();',
    'const { itensAmaldicoadosHook, poderesHook, trilhasHook, nex } = useRPG();'
  );
}

const useMemoStr = `
  const temCriarSelo = useMemo(() => {
    return Object.values(poderesHook.poderesEscolhidos).some(p => p.nome.toLowerCase().includes('criar selo')) || (trilhasHook.trilhaSelecionada?.Nome_Trilha === 'Criptologista do Oculto' && nex >= 10);
  }, [poderesHook.poderesEscolhidos, trilhasHook.trilhaSelecionada, nex]);
`;

if (!content.includes('const temCriarSelo = useMemo')) {
  content = content.replace(
    "const [busca, setBusca] = useState('');",
    useMemoStr + "\n  const [busca, setBusca] = useState('');"
  );
}

const originalButton = `<button 
                          onClick={(e) => {
                            e.stopPropagation();
                            adicionarItem(item);
                            fechar();
                          }}
                          className="ml-auto shrink-0 px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors active:scale-95"
                        >
                          + Adicionar
                        </button>`;

const newButton = `
                        {item.Nome_Ama === 'Selos Paranormais' && !temCriarSelo ? (
                          <button 
                            disabled
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            title="Requer o poder 'Criar Selo' ou trilha Criptologista do Oculto."
                            className="ml-auto shrink-0 px-3 py-1 bg-zinc-800 text-zinc-500 rounded font-bold text-[10px] uppercase tracking-wider cursor-not-allowed"
                          >
                            Bloqueado
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              adicionarItem(item);
                              fechar();
                            }}
                            className="ml-auto shrink-0 px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors active:scale-95"
                          >
                            + Adicionar
                          </button>
                        )}`;

if (content.includes(originalButton)) {
  content = content.split(originalButton).join(newButton);
}

fs.writeFileSync(file, content);
console.log('Update success');
