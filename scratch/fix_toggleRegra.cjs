const fs = require('fs');
let c = fs.readFileSync('src/context/RPGContext.tsx', 'utf-8');

c = c.replace(/const toggleRegra = useCallback[\\s\\S]*?\\], \\\[nex\\\]\\);/,
\`const toggleRegra = useCallback((nome: string) => {
    setRegras(prev => {
      const novo = { ...prev, [nome]: !prev[nome] };
      if (nome === 'nex_experiencia') {
        if (novo[nome]) {
          setNivel(Math.min(20, Math.max(1, Math.ceil(nex / 5))));
          setNex(0);
        } else {
          setNex(Math.min(99, nivel * 5));
        }
      }
      return novo;
    });
  }, [nex, nivel]);\`);

fs.writeFileSync('src/context/RPGContext.tsx', c, 'utf-8');
console.log('Success regex');
