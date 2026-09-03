const fs = require('fs');
let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');
const regex = /\{simboloImg && !expandido && \(\s*<img[\s\S]*?shrink-0 -my-3"\s*\/>\s*\)\}/;
const match = content.match(regex);
console.log('Match AbasPanel:', !!match);
