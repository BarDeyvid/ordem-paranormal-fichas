const fs = require('fs');
const file = 'src/screens/Ficha/AbasPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const searchStr = 'className="flex cursor-pointer flex-col p-3 transition hover:bg-zinc-800"';
const newStr = 'className="flex cursor-pointer flex-col bg-zinc-800/40 px-4 py-3 transition hover:bg-zinc-700/50"';

if (content.includes(searchStr)) {
  content = content.replace(searchStr, newStr);
  fs.writeFileSync(file, content);
  console.log('Fixed header bg for Trilha block');
} else {
  console.log('Could not find the exact string');
}
