const fs = require('fs');
const p = 'src/screens/Ficha/PericiasTable.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /\{\/\* REGRAS AUTOMÁTICAS INLINE \*\/\}\s*\{\(regrasAutomaticasAtivas\.has\(8\) \|\| regrasAutomaticasAtivas\.has\(13\) \|\| regrasAutomaticasAtivas\.has\(25\)\) && \(\s*<div className="flex gap-2 flex-wrap mt-2 pt-2 border-t border-zinc-800\/50">\s*\{regrasAutomaticasAtivas\.has\(8\) && <span className="rounded bg-green-900\/30 px-2 py-0\.5 text-xs text-green-400 border border-green-900\/50 flex items-center gap-1\.5"><span className="w-1\.5 h-1\.5 rounded-full bg-green-500 animate-pulse"><\/span>\+2 Diplomacia \(Automático\)<\/span>\}\s*\{regrasAutomaticasAtivas\.has\(13\) && <span className="rounded bg-green-900\/30 px-2 py-0\.5 text-xs text-green-400 border border-green-900\/50 flex items-center gap-1\.5"><span className="w-1\.5 h-1\.5 rounded-full bg-green-500 animate-pulse"><\/span>\+2 Vontade \(Automático\)<\/span>\}\s*\{regrasAutomaticasAtivas\.has\(25\) && temProtecaoLeve && <span className="rounded bg-green-900\/30 px-2 py-0\.5 text-xs text-green-400 border border-green-900\/50 flex items-center gap-1\.5"><span className="w-1\.5 h-1\.5 rounded-full bg-green-500 animate-pulse"><\/span>\+2 Reflexos \(Automático\)<\/span>\}\s*<\/div>\s*\)\}/g,
  ""
);

fs.writeFileSync(p, c, 'utf8');
