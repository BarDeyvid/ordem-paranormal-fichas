const fs = require('fs');
let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

content = content.replace(/const { classe, nex, modificacoesHook.*\n  const \[ritualExpandido, setRitualExpandido\] = useState\(false\);\n  const nivel = calcularNivel\(nex\);/g, `const { modificacoesHook, rituaisHook, itensAmaldicoadosHook, versaoRitual, setVersaoRitual } = useRPG();\n  const [ritualExpandido, setRitualExpandido] = useState(false);`);

fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
console.log('Cleaned up unused variables');
