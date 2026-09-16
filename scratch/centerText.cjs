const fs = require('fs');
let content = fs.readFileSync('src/screens/ClasseScreen.tsx', 'utf8');

// Replace combatente/especialista
content = content.replace(
  /<p className="flex-grow text-sm leading-relaxed text-zinc-400">/g,
  `<p className="flex-grow text-sm leading-relaxed text-zinc-400 text-center">`
);

// Replace ocultista
content = content.replace(
  /<p className="flex-grow text-\[13px\] leading-relaxed text-zinc-400">/g,
  `<p className="flex-grow text-[13px] leading-relaxed text-zinc-400 text-center">`
);

fs.writeFileSync('src/screens/ClasseScreen.tsx', content);
console.log('Added text-center to class descriptions');
