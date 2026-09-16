const fs = require('fs');
const content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');
const searchIdx = content.indexOf('className="overflow-hidden rounded-r border-l-4 bg-zinc-900/70"');
console.log(content.substring(Math.max(0, searchIdx - 100), searchIdx + 2000));
