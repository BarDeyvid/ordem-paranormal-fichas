const fs = require('fs');

function fixRitualElementHeader(file) {
  let content = fs.readFileSync(file, 'utf8');

  // The block we want to replace
  const searchBlock = `<div className="flex items-center gap-1.5 mb-1 pl-0.5 pr-1">
                                  <span className="text-[0.55rem] font-bold uppercase tracking-wider text-zinc-600 ml-1">↳</span>
                                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-zinc-600">{elemento}</span>
                                  <div className="h-px flex-1 bg-zinc-800/50"></div>
                                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400" title="10 + PRE + Nível">DT {baseDT}</span>
                                </div>`;

  const replaceBlock = `<div className="flex items-center gap-3 mb-1">
                                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: obterCorBadge(elemento) || '#52525b' }}></span>
                                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-zinc-500">{elemento}</span>
                                  <div className="flex-1 border-t border-zinc-800/50"></div>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500" title="10 + PRE + Nível">DT {baseDT}</span>
                                </div>`;

  if (content.includes(searchBlock)) {
    content = content.replace(searchBlock, replaceBlock);
    fs.writeFileSync(file, content);
    console.log("Successfully replaced ritual element header in " + file);
  } else {
    console.log("Could not find the target block in " + file);
  }
}

fixRitualElementHeader('src/screens/Ficha/AbasPanel.tsx');
