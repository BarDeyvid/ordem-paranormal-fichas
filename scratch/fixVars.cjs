const fs = require('fs');
let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

// 1. Add `useState` if it's missing
if (!content.includes('const [ritualExpandido, setRitualExpandido] = useState(false);')) {
  content = content.replace(
    `const { modificacoesHook, rituaisHook, itensAmaldicoadosHook, versaoRitual, setVersaoRitual } = useRPG();`,
    `const { classe, nex, modificacoesHook, rituaisHook, itensAmaldicoadosHook, versaoRitual, setVersaoRitual } = useRPG();\n  const [ritualExpandido, setRitualExpandido] = useState(false);\n  const nivel = calcularNivel(nex);`
  );
}

fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
console.log('Fixed undefined variables');
