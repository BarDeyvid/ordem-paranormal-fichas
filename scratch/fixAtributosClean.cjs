const fs = require('fs');
let content = fs.readFileSync('src/screens/AtributosScreen.tsx', 'utf8');

const regex = /<div className="w-full max-w-3xl text-sm leading-relaxed text-zinc-400 space-y-4">[\s\S]*?<\/div>/;
const newHeaderText = `<div className="w-full max-w-3xl text-sm leading-relaxed text-zinc-400 space-y-4">
          <p>
            Quando você cria um personagem, todos os seus atributos começam em 1 e você recebe 4 pontos para distribuir entre eles como quiser. Você também pode reduzir um atributo para 0 para receber 1 ponto adicional. O valor máximo inicial que você pode ter em cada atributo é 3.
          </p>
        </div>`;

content = content.replace(regex, newHeaderText);

const layoutRegex = /\{\/\* CONTAINER PRINCIPAL \*\/\}[\s\S]*?\{\/\* COLUNA DIREITA: Pentagrama \*\/\}\s*<div className="flex flex-col items-center order-1 md:order-2 w-full max-w-\[460px\]">/g;

const newLayout = `{/* CAIXA DE CONFIGURAÇÃO (NEX & PONTOS) */}
      <div className="mx-auto mb-10 flex w-fit flex-col sm:flex-row items-center justify-center gap-8 rounded-lg border border-zinc-800 bg-zinc-900/60 px-8 py-5 relative z-50 shadow-lg">
        
        <div className="flex items-center gap-4">
          <label htmlFor="nex-select" className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            NEX Inicial
          </label>
          <CustomSelect 
            value={nex.toString()} 
            onChange={handleNexChange} 
            options={NEX_OPTIONS.map(n => ({ value: n.toString(), label: n + "%" }))} 
            wrapperClassName="w-24" 
          />
        </div>

        <div className="hidden h-8 w-px bg-zinc-700/50 sm:block"></div>

        <div className={\`flex items-center gap-4 text-sm font-bold uppercase tracking-wider \${pontosRestantes < 0 ? 'text-red-500' : 'text-zinc-300'}\`}>
          <span>Pontos Restantes</span>
          <span className={\`text-2xl \${pontosRestantes > 0 ? 'text-green-500' : (pontosRestantes < 0 ? 'text-red-500' : 'text-zinc-500')}\`}>
            {pontosRestantes}
          </span>
        </div>

      </div>

      {/* PENTAGRAMA DE ATRIBUTOS */}
      <div className="flex flex-col items-center justify-center w-full max-w-[460px] mx-auto">`;

content = content.replace(layoutRegex, newLayout);

fs.writeFileSync('src/screens/AtributosScreen.tsx', content);
console.log('Fixed AtributosScreen layout');
