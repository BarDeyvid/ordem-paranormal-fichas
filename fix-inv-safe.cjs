const fs = require('fs');
let c = fs.readFileSync('src/screens/Ficha/InventarioPanel.tsx', 'utf8');

// 1. Fix undefined armasNormaisExibidas
const regexArmasExibidas = /let armasExibidas = \[\.\.\.\(armasHook\?\.armasInventario \|\| \[\]\)\].filter\(a => a\.id !== 'coronhada-virtual' && a\.id !== 'ataque-desarmado-virtual'\);\s*armasExibidas = armasExibidas\.filter\(\(item: ArmaInventario\) => \{\s*if \(buscaItem && !item\.arma\.Nome_Item\.toLowerCase\(\)\.includes\(buscaItem\.toLowerCase\(\)\)\) return false;\s*return true;\s*\}\);/;

const replaceStr = `let armasExibidas = [...(armasHook?.armasInventario || [])].filter(a => a.id !== 'coronhada-virtual' && a.id !== 'ataque-desarmado-virtual');
  armasExibidas = armasExibidas.filter((item: ArmaInventario) => {
    if (buscaItem && !item.arma.Nome_Item.toLowerCase().includes(buscaItem.toLowerCase())) return false;
    return true;
  });
  
  const armasNormaisExibidas = armasExibidas; // Temp debug: armasExibidas.filter(i => !i.arma.isAmaldicoada);
  const armasAmaldicoadasExibidas = armasExibidas.filter(i => i.arma.isAmaldicoada);`;

c = c.replace(regexArmasExibidas, replaceStr);
c = c.replace(/armasExibidas\.length/g, 'armasNormaisExibidas.length'); // Safely replace .length calls 

// 2. Safely replace the Amaldiçoados block
const blockRegex = /\{\(categoriaFiltro === 'Amaldiçoados' \|\| categoriaFiltro === 'Geral'\) && \(\(itensAmaldicoadosHook\?\.itensAmaldicoadosInventario\?\.length \|\| 0\) > 0\) && \([\s\S]*?Nenhum item amaldiçoado no inventário\.<\/p>\s*\)\}\s*<\/>\s*\)\}/;

const newBlock = `{(categoriaFiltro === 'Amaldiçoados' || categoriaFiltro === 'Geral') && ((itensAmaldicoadosHook?.itensAmaldicoadosInventario?.length || 0) > 0 || armasAmaldicoadasExibidas.length > 0) && (
                <>
                  {(categoriaFiltro === 'Geral' || categoriaFiltro === 'Amaldiçoados') && armasAmaldicoadasExibidas.length > 0 && (
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1 mt-2 border-b border-zinc-800 pb-1">Armas Amaldiçoadas</h3>
                  )}
                  <SortableContext items={armasAmaldicoadasExibidas.map(a => a.id)} strategy={verticalListSortingStrategy}>
                    {armasAmaldicoadasExibidas.map((item: ArmaInventario) => (
                      <SortableArmaItem
                        key={item.id}
                        item={item}
                        isExpanded={!!expandidos[item.id]}
                        toggleExpandir={toggleExpandir}
                        stringDT={calcularDT(item.arma.dt_item, item.arma.Categoria_Item?.toLowerCase().includes('explosivos') || item.arma.Nome_Item?.toLowerCase().includes('explosivo'))}
                        removerArma={armasHook?.removerArma || (() => {})}
                          onEditar={() => setArmaEditandoId(item.id)}
                          onAddMunicao={() => {
                            if (item.arma.Nome_Item === 'A Antena') {
                              alert("Por favor, selecione um ritual (em breve modal de seleção)");
                            } else if (item.arma.Nome_Item?.toLowerCase().includes('lançador de granadas') || item.arma.Nome_Item?.toLowerCase().includes('lancador de granadas')) {
                              setGranadaTargetArmaId(item.id);
                              setModalGranadasAberto(true);
                            } else {
                              setMunicaoTargetArmaId(item.id);
                              setMunicaoFiltroNome(item.arma.Nome_Item);
                              setMunicaoFiltroCategoria(item.arma.Categoria_Item);
                              setModalMunicoesAberto(true);
                            }
                          }}
                        />
                    ))}
                  </SortableContext>
                  {(categoriaFiltro === 'Geral' || categoriaFiltro === 'Amaldiçoados') && (itensAmaldicoadosHook?.itensAmaldicoadosInventario?.length || 0) > 0 && (
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1 mt-2 border-b border-zinc-800 pb-1">Itens Amaldiçoados</h3>
                  )}
                  <SortableContext items={(itensAmaldicoadosHook?.itensAmaldicoadosInventario || []).map(i => i.id)} strategy={verticalListSortingStrategy}>
                  {(itensAmaldicoadosHook?.itensAmaldicoadosInventario || [])
                    .filter(item => buscaItem.trim() === '' || item.item.Nome_Ama.toLowerCase().includes(buscaItem.toLowerCase()))
                    .map(item => (
                    <SortableItemAmaldicoado
                      key={item.id}
                      item={item}
                      isExpanded={!!expandidos[item.id]}
                      toggleExpandir={toggleExpandir}
                      removerItem={itensAmaldicoadosHook?.removerItem || (() => {})}
                      onEditar={() => setEditingItemAmaldicoado(item)}
                      stringDT={null}
                      toggleEquipado={(id) => toggleVestimentaGeral(id, true)}
                    />
                  ))}
                </SortableContext>
                {categoriaFiltro === 'Amaldiçoados' && (itensAmaldicoadosHook?.itensAmaldicoadosInventario?.length || 0) === 0 && armasAmaldicoadasExibidas.length === 0 && (
                  <p className="text-center text-zinc-600 text-sm py-4">Nenhum item amaldiçoado no inventário.</p>
                )}
                </>
              )}`;

c = c.replace(blockRegex, newBlock);

fs.writeFileSync('src/screens/Ficha/InventarioPanel.tsx', c);
