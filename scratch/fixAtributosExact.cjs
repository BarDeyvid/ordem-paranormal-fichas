const fs = require('fs');

let content = fs.readFileSync('src/screens/AtributosScreen.tsx', 'utf8');

const startIdx = content.indexOf('{/* SELETOR DE NEX */}');
const endIdx = content.indexOf('aspect-square">') + 'aspect-square">'.length;

const before = content.substring(0, startIdx);
const after = content.substring(endIdx);

const newLayout = `{/* CONTAINER PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 w-full mt-4">
        
        {/* COLUNA ESQUERDA: Textos e Configurações */}
        <div className="flex flex-col w-full max-w-[340px] gap-6 order-2 md:order-1 md:pt-8">
          
          <div className="text-sm leading-relaxed text-zinc-400 text-justify">
            <p>
              Quando você cria um personagem, todos os seus atributos começam em 1 e você recebe 4 pontos para distribuir entre eles como quiser. Você também pode reduzir um atributo para 0 para receber 1 ponto adicional. O valor máximo inicial que você pode ter em cada atributo é 3.
            </p>
          </div>

          <div className="h-px w-full bg-zinc-800/80"></div>

          {/* CAIXA DE CONFIGURAÇÃO */}
          <div className="flex flex-col gap-5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-5 relative z-50 shadow-lg">
            <h3 className="font-display text-base uppercase tracking-wider text-green-500 mb-1">
              Configurações
            </h3>
            
            <div className="flex items-center justify-between">
              <label htmlFor="nex-select" className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                NEX Inicial
              </label>
              <CustomSelect 
                value={nex.toString()} 
                onChange={handleNexChange} 
                options={NEX_OPTIONS.map(n => ({ value: n.toString(), label: n + "%" }))} 
                wrapperClassName="w-28" 
              />
            </div>

            <div className={\`flex items-center justify-between text-sm font-bold uppercase tracking-wider pt-4 border-t border-zinc-800/50 \${pontosRestantes < 0 ? 'text-red-500' : 'text-zinc-300'}\`}>
              <span>Pontos Restantes</span>
              <span className={\`text-2xl \${pontosRestantes > 0 ? 'text-green-500' : (pontosRestantes < 0 ? 'text-red-500' : 'text-zinc-600')}\`}>
                {pontosRestantes}
              </span>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Pentagrama */}
        <div className="flex flex-col items-center order-1 md:order-2 w-full max-w-[460px]">
        <div className="relative w-full aspect-square">`;

fs.writeFileSync('src/screens/AtributosScreen.tsx', before + newLayout + after);
console.log('Fixed AtributosScreen layout exactly');
