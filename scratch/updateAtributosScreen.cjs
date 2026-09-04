const fs = require('fs');
const file = 'src/screens/AtributosScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('{/* LISTA DE ATRIBUTOS */}');
const endTextIdx = content.indexOf('Avançar para Origens');
const endIdx = content.lastIndexOf('<button', endTextIdx);

const newBlock = `{/* LISTA DE ATRIBUTOS */}
      <div className="mb-10 mt-6 flex justify-center w-full">
        <div className="relative w-full max-w-[340px] aspect-square">
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
                  <span className="min-w-5 text-center text-3xl font-black text-zinc-100 drop-shadow-md pointer-events-none">{atributos[nome]}</span>
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

      `;

content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
fs.writeFileSync(file, content);
console.log('Updated AtributosScreen');
