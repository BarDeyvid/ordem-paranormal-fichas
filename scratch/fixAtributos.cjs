const fs = require('fs');

let content = fs.readFileSync('src/screens/AtributosScreen.tsx', 'utf8');

const regex = /\{\/\* SELETOR DE NEX \*\/\}\s*<div className="mb-6 flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900\/60 p-4 relative z-50">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newLayout = `{/* CONTAINER PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-12 w-full mt-8">
        
        {/* COLUNA ESQUERDA: Textos e Configurações */}
        <div className="flex flex-col w-full max-w-[340px] gap-6 order-2 md:order-1 pt-4">
          
          <div className="text-sm leading-relaxed text-zinc-400 text-justify">
            <p>
              Quando você cria um personagem, todos os seus atributos começam em 1 e você recebe 4 pontos para distribuir entre eles como quiser. Você também pode reduzir um atributo para 0 para receber 1 ponto adicional. O valor máximo inicial que você pode ter em cada atributo é 3.
            </p>
          </div>

          <div className="h-px w-full bg-zinc-800/80"></div>

          {/* CAIXA DE CONFIGURAÇÃO */}
          <div className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-5 relative z-50">
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
        <div className="relative w-full aspect-square">
          <img src="/images/atributos-bg.png" alt="Atributos" className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
          
          {(() => {
            const renderAtributo = (nome, posClasses) => {
              const temAtributoZerado = Object.values(atributos).some(v => v === 0);
              const naoPodeDiminuir = atributos[nome] === 0 || (atributos[nome] === 1 && temAtributoZerado);
              const naoPodeAumentar = pontosRestantes <= 0 || atributos[nome] >= capMaximoAtributo(nivel);

              return (
                <div key={nome} className={\`absolute flex items-center justify-center gap-1.5 \${posClasses}\`}>
                  <button
                    onClick={() => alterarAtributo(nome, 'diminuir')}
                    disabled={naoPodeDiminuir}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-lg font-bold text-zinc-300 transition hover:border-red-700 hover:text-red-500 hover:bg-red-900/20 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300 disabled:hover:bg-zinc-900 pointer-events-auto"
                  >
                    −
                  </button>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-900 font-display text-2xl text-zinc-100 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    {atributos[nome]}
                  </div>
                  <button
                    onClick={() => alterarAtributo(nome, 'aumentar')}
                    disabled={naoPodeAumentar}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-lg font-bold text-zinc-300 transition hover:border-green-700 hover:text-green-500 hover:bg-green-900/20 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300 disabled:hover:bg-zinc-900 pointer-events-auto"
                  >
                    +
                  </button>
                </div>
              );
            };

            return (
              <>
                {renderAtributo('AGI', 'top-[16%] left-[50%] -translate-x-1/2 -translate-y-1/2')}
                {renderAtributo('INT', 'top-[36%] right-[19%] translate-x-1/2 -translate-y-1/2')}
                {renderAtributo('VIG', 'top-[74%] right-[28%] translate-x-1/2 -translate-y-1/2')}
                {renderAtributo('PRE', 'top-[74%] left-[27%] -translate-x-1/2 -translate-y-1/2')}
                {renderAtributo('FOR', 'top-[36%] left-[19%] -translate-x-1/2 -translate-y-1/2')}
              </>
            );
          })()}
        </div>
        </div>
      </div>`;

content = content.replace(regex, newLayout);
fs.writeFileSync('src/screens/AtributosScreen.tsx', content);
console.log('Fixed AtributosScreen layout');
