const fs = require('fs');

function fixRitualElementHeader(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Regex to match the entire <div className="flex items-center gap-1.5 mb-1 pl-0.5 pr-1"> containing the ↳
  const regex = /<div className="flex items-center gap-1\.5 mb-1 pl-0\.5 pr-1">[\s\S]*?↳[\s\S]*?DT \{baseDT\}<\/span>\s*<\/div>/;

  const replaceBlock = `<div className="flex items-center gap-3 mb-1 mt-1">
                                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: obterCorBadge(elemento) || '#52525b' }}></span>
                                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-zinc-500">{elemento}</span>
                                  <div className="flex-1 border-t border-zinc-800/50"></div>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500" title="10 + PRE + Nível">DT {baseDT}</span>
                                </div>`;

  if (regex.test(content)) {
    content = content.replace(regex, replaceBlock);
    fs.writeFileSync(file, content);
    console.log("Successfully replaced ritual element header in " + file);
  } else {
    console.log("Could not find the target block in " + file);
  }
}

fixRitualElementHeader('src/screens/Ficha/AbasPanel.tsx');
