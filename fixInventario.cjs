
const fs = require('fs');
let content = fs.readFileSync('src/screens/Ficha/InventarioPanel.tsx', 'utf8');

const regex = /const extraDef = modsAtuais\.some\(m => m\?\.Nome_Modif\?\.trim\(\)\.toLowerCase\(\) === 'refor.{1,2}ada'\) \? 2 : 0;/g;

const replacement = \const extraDefMod = modsAtuais.some(m => m?.Nome_Modif?.trim().toLowerCase() === 'reforçada') ? 2 : 0;
                    const extraDefMald = maldicoesAtuais.reduce((acc, m) => {
                      const nome = m?.Nome_Mald?.trim().toLowerCase();
                      if (nome === 'cinética') return acc + 2;
                      if (nome === 'letárgica') return acc + 2;
                      if (nome === 'defesa') return acc + 5;
                      return acc;
                    }, 0);
                    const extraDef = extraDefMod + extraDefMald;\;

content = content.replace(regex, replacement);
fs.writeFileSync('src/screens/Ficha/InventarioPanel.tsx', content, 'utf8');

