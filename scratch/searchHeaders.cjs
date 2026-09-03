const fs = require('fs');
let content = fs.readFileSync('src/components/ModalPoderes.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('Poderes de') || line.includes('border-l-') || line.includes('text-zinc-500 font-bold uppercase')) {
    console.log(`[${i}] ${line.trim()}`);
  }
});
