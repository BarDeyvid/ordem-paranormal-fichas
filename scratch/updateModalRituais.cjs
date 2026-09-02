const fs = require('fs');
let content = fs.readFileSync('src/components/ModalRituais.tsx', 'utf8');

content = content.replace(
  "const isLista = ritual.Elemento_Ritual.toLowerCase() === 'lista' || ritual.Elemento_Ritual.toLowerCase() === 'varia';",
  "const isLista = ritual.Elemento_Ritual.toLowerCase() === 'lista' || ritual.Elemento_Ritual.toLowerCase() === 'varia';\n    const simboloImg = rituaisHook.simbolosRituais?.get(ritual.Codigo_Ritual) || '';"
);

content = content.replace(
  /<div className="flex items-center gap-2">\s*{\/\* PE \*\/}\s*<span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0\.5 text-xs font-bold text-blue-400">\s*{pe} PE\s*<\/span>/,
  `<div className="flex items-center gap-2">
          {simboloImg && !expandido && (
            <img
              src={simboloImg}
              alt=""
              className="h-10 w-10 rounded object-contain opacity-70"
              loading="lazy"
            />
          )}
          {/* PE */}
          <span className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs font-bold text-blue-400">
            {pe} PE
          </span>`
);

content = content.replace(
  /<div className="mb-3 flex flex-col gap-1">\s*{execucao && \(/,
  `<div className="flex gap-4 mb-3">
            {simboloImg && (
              <img
                src={simboloImg}
                alt=""
                className="h-16 w-16 rounded border border-zinc-800 bg-zinc-950/50 object-contain p-1 shrink-0"
                loading="lazy"
              />
            )}
            <div className="flex flex-col gap-1 flex-1">
              {execucao && (`
);

content = content.replace(
  /                <span className="text-zinc-400">{resistencia\.split\('\/'\)\[0\]}<\/span>\s*<\/div>\s*\)}\s*<\/div>\s*<\/div>\s*<\/Collapse>/,
  `                <span className="text-zinc-400">{resistencia.split('/')[0]}</span>
              </div>
            )}
            </div>
          </div>

        </div>
      </Collapse>`
);

fs.writeFileSync('src/components/ModalRituais.tsx', content);
console.log('Script executed for ModalRituais');
