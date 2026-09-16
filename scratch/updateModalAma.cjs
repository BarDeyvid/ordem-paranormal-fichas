const fs = require('fs');
const file = 'src/screens/Ficha/ModalItensAmaldicoados.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace 1: Add hooks
content = content.replace(
  "const { itensAmaldicoadosHook } = useRPG();",
  "const { itensAmaldicoadosHook, poderesHook, trilhasHook, nex } = useRPG();"
);

// Replace 2: Add temCriarSelo
const useMemoAdd = `
  const temCriarSelo = useMemo(() => {
    return Object.values(poderesHook.poderesEscolhidos).some(p => p.nome.toLowerCase().includes('criar selo')) || (trilhasHook.trilhaSelecionada?.Nome_Trilha === 'Criptologista do Oculto' && nex >= 10);
  }, [poderesHook.poderesEscolhidos, trilhasHook.trilhaSelecionada, nex]);
`;
content = content.replace(
  "const [busca, setBusca] = useState('');",
  useMemoAdd + "\n  const [busca, setBusca] = useState('');"
);

// Replace 3 & 4: the render loops
// Since there are two render loops (one for even, one for odd), let's replace the button part.
const buttonReplaceStr = `<button 
                          onClick={(e) => {
                            e.stopPropagation();
                            adicionarItem(item);
                            fechar();
                          }}
                          className="ml-auto shrink-0 px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors active:scale-95"
                        >
                          + Adicionar
                        </button>`;

const newButtonRender = `
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

content = content.split(buttonReplaceStr).join(newButtonRender);

fs.writeFileSync(file, content);
console.log('Updated ModalItensAmaldicoados');
