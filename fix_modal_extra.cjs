const fs = require('fs');

let c = fs.readFileSync('src/components/ModalRituaisExtra.tsx', 'utf8');
c = c.replace(/const simboloImg = getSimboloUrl\(ritual\.Codigo_Ritual, undefined\);/g, "const simboloImg = getSimboloUrl(ritual.Codigo_Ritual, elementoSendoEscolhido);");

fs.writeFileSync('src/components/ModalRituaisExtra.tsx', c);
