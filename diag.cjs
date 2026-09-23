const fs = require('fs');
let c = fs.readFileSync('src/screens/Ficha/ModalItensAmaldicoados.tsx', 'utf8');

const regex = /if \(item\._tipo === 'arma'\) \{/g;
const replacement = `if (item._tipo === 'arma') {
    if (!armasHook) {
      alert("ERRO CRÍTICO: armasHook está offline! Avise o Antigravity!");
    } else {
      armasHook.adicionarArma({ ...item, isAmaldicoada: true, isDuplaObsessivaLinked: item.Nome_Item?.includes('Dupla Obsessiva') ? true : undefined });
      alert("Arma adicionada com sucesso! Feche o modal e verifique a aba Amaldiçoados.");
    }`;

c = c.replace(regex, replacement);

fs.writeFileSync('src/screens/Ficha/ModalItensAmaldicoados.tsx', c);
