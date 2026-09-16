const fs = require('fs');
let c = fs.readFileSync('src/components/ModalPoderesExtra.tsx', 'utf8');

const regex = /\{\!val\.atende && val\.motivo && \([\s\S]*?<\/div>\s*\)\}/g;
c = c.replace(regex, '');

fs.writeFileSync('src/components/ModalPoderesExtra.tsx', c, 'utf8');
