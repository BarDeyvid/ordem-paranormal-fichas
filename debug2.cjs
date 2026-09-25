const fs = require('fs');

let c = fs.readFileSync('src/screens/Ficha/CombatePanel.tsx', 'utf8');

c = c.replace(/const danoHeader = parsedDano\n\s*\.filter\(p => p\.label !== 'Dano Secundário'\)\n\s*\.map\(\(p, i\) => \{\n\s*let v = p\.valor;\n\s*if \(i > 0 && !v\.startsWith\('\+'\) && !v\.startsWith\('-'\)\) v = '\+' \+ v;\n\s*return v;\n\s*\}\)\n\s*\.join\(''\);/g, `const danoHeader = JSON.stringify({ td: arma.Tipo_Dano_Arma, ds: arma.Dano_Secundario, da: arma.Dano_Arma, ts: tipoSecundario });`);

fs.writeFileSync('src/screens/Ficha/CombatePanel.tsx', c);
