const fs = require('fs');
const content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');

let search = 'bg-zinc-900/40';
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(search) && lines[i].includes('border-green-800')) {
    console.log('['+i+'] ' + lines[i].trim());
  }
}

console.log('--- Checking all bg-zinc-900 uses in AbasPanel ---');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('key={hab.id}') && lines[i].includes('bg-zinc-900')) {
    console.log('['+i+'] ' + lines[i].trim());
  }
}
