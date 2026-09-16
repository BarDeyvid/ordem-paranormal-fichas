const fs = require('fs');
let content = fs.readFileSync('src/screens/AtributosScreen.tsx', 'utf8');

const regex = /<div className="flex-1 text-sm leading-relaxed text-zinc-400 text-left order-2 md:order-1">/;
const replace = `<div className="w-full max-w-[280px] text-base leading-relaxed text-zinc-400 text-left order-2 md:order-1 ml-auto">`;

content = content.replace(regex, replace);
fs.writeFileSync('src/screens/AtributosScreen.tsx', content);
console.log('Fixed text size and width');
