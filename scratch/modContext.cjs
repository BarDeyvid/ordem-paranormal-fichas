const fs = require('fs');
let content = fs.readFileSync('src/context/RPGContext.tsx', 'utf8');

const insertPoint = content.indexOf('const atributosBaseComBonus = useMemo(() => {');
const injection = `
  const effectiveNex = useMemo(() => {
    let finalNex = nex;
    if (regrasAutomaticasAtivas.has(83)) finalNex += 5;
    return Math.min(99, finalNex);
  }, [nex, regrasAutomaticasAtivas]);

  const effectiveNivel = useMemo(() => {
    let finalNivel = nivel;
    if (regrasAutomaticasAtivas.has(83)) finalNivel += 1;
    return Math.min(20, finalNivel);
  }, [nivel, regrasAutomaticasAtivas]);

`;
content = content.substring(0, insertPoint) + injection + content.substring(insertPoint);

content = content.replace(/const status = useStatus\(classe, nex, nivel/g, 'const status = useStatus(classe, effectiveNex, effectiveNivel');
content = content.replace(/const periciasHook = usePericias\([\s\S]*?classe,[\s\S]*?nex,[\s\S]*?atributosBaseComBonus/g, (match) => match.replace(/nex,/, 'effectiveNex,'));
// Also replace in usePoderes if it exists
// Wait, usePoderes is called like usePoderes(classe) in Context, wait no, let's just see.

fs.writeFileSync('src/context/RPGContext.tsx', content);
console.log('Modified RPGContext');
