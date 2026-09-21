const fs = require('fs');

function updateModal(file, isArma) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix catFinal logic
  let newCatLogic = '';
  if (isArma) {
    newCatLogic = `
    const catNum = categoriaRomanParaNum(categoria);
    let modificador = modificacoes.length;
    if (temApocaliptica) modificador -= 1;
    let custoMaldicoes = maldicoes.length > 0 ? 2 + (maldicoes.length - 1) : 0;
    const catFinal = catNum + modificador + custoMaldicoes;
    const custoAtual = modificador + custoMaldicoes;
    const podeAdicionarMod = catFinal < 4;
    const custoProximaMaldicao = maldicoes.length === 0 ? 2 : 1;
    const podeAdicionarMald = (catFinal + custoProximaMaldicao) <= 4;
`;
  } else {
    newCatLogic = `
    const catNum = categoriaRomanParaNum(categoria);
    let modificador = modificacoes.length;
    let custoMaldicoes = maldicoes.length > 0 ? 2 + (maldicoes.length - 1) : 0;
    const catFinal = catNum + modificador + custoMaldicoes;
    const custoAtual = modificador + custoMaldicoes;
    const podeAdicionarMod = catFinal < 4;
    const custoProximaMaldicao = maldicoes.length === 0 ? 2 : 1;
    const podeAdicionarMald = (catFinal + custoProximaMaldicao) <= 4;
`;
  }

  content = content.replace(/const catNum = categoriaRomanParaNum\(categoria\);[\s\S]*?(?=const handleAddMald|const handleAddMod)/, newCatLogic + '  ');

  const customSelectStr = `<InputLabel label="Categoria" />
                  <CustomSelect
                    value={categoriaNumParaRoman(catFinal)}
                    onChange={(val) => {
                      const finalDesejado = categoriaRomanParaNum(val);
                      setCategoria(categoriaNumParaRoman(Math.max(0, finalDesejado - custoAtual)));
                    }}
                    options={[
                      { value: categoriaNumParaRoman(Math.min(4, 0 + custoAtual)), label: categoriaNumParaRoman(Math.min(4, 0 + custoAtual)) },
                      { value: categoriaNumParaRoman(Math.min(4, 1 + custoAtual)), label: categoriaNumParaRoman(Math.min(4, 1 + custoAtual)) },
                      { value: categoriaNumParaRoman(Math.min(4, 2 + custoAtual)), label: categoriaNumParaRoman(Math.min(4, 2 + custoAtual)) },
                      { value: categoriaNumParaRoman(Math.min(4, 3 + custoAtual)), label: categoriaNumParaRoman(Math.min(4, 3 + custoAtual)) },
                      { value: categoriaNumParaRoman(Math.min(4, 4 + custoAtual)), label: categoriaNumParaRoman(Math.min(4, 4 + custoAtual)) }
                    ].filter((opt, index, self) => index === self.findIndex((t) => t.value === opt.value))}
                  />`;
  
  content = content.replace(/<InputLabel label="Categoria" \/>\s*<InputOtimizado[\s\S]*?className=\{inputClass\}\s*\/>/g, customSelectStr);

  if (!content.includes('import { CustomSelect }')) {
    content = content.replace(/import \{ InputOtimizado \}/, 'import { InputOtimizado }\nimport { CustomSelect }');
  }

  fs.writeFileSync(file, content, 'utf8');
}

updateModal('src/components/ModalEditarArma.tsx', true);
updateModal('src/components/ModalEditarProtecao.tsx', false);
updateModal('src/components/ModalEditarItem.tsx', false);
updateModal('src/components/ModalEditarMunicao.tsx', false);
