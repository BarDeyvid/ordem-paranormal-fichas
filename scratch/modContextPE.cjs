const fs = require('fs');
let content = fs.readFileSync('src/context/RPGContext.tsx', 'utf8');

const insertPoint = content.indexOf('const atributosFinais = useMemo(() => {');
const injection = `
  useEffect(() => {
    if (regrasAutomaticasAtivas.has(83)) {
      if ((regras['nex_experiencia'] && nivel >= 20) || (!regras['nex_experiencia'] && nex >= 95)) {
        if (!status.hasPeTemp) {
          status.setHasPeTemp(true);
          status.setPeTempMax(10);
          status.setPeTempAtual(10);
        }
      }
    }
  }, [regrasAutomaticasAtivas, nex, nivel, regras, status]);

`;

content = content.substring(0, insertPoint) + injection + content.substring(insertPoint);
fs.writeFileSync('src/context/RPGContext.tsx', content);
console.log('Modified RPGContext PE temp');
