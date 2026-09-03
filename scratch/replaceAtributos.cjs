const fs = require('fs');

const file = 'src/screens/Ficha/index.tsx';
let content = fs.readFileSync(file, 'utf8');

const start = content.indexOf('function AtributosFicha() {');
const end = content.indexOf('// ============================================================', start);

const newFunction = `function AtributosFicha() {
  const { atributos, setAtributos, bonusAtributos, setBonusAtributos, bloquearLetras, atributosFinais } = useRPG();

  const renderAtributo = (nome, posClasses) => {
    return (
      <div key={nome} className={\`absolute flex flex-col items-center justify-center \${posClasses}\`}>
          <div className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full border border-amber-500 bg-zinc-950 shadow-md z-10" title="Bônus temporário">
            <input
              type="number"
              onKeyDown={bloquearLetras}
              value={bonusAtributos[nome]}
              onChange={(e) =>
                setBonusAtributos({ ...bonusAtributos, [nome]: Math.max(0, Number(e.target.value)) })
              }
              className="w-full bg-transparent text-center text-[10px] font-bold text-amber-400 outline-none"
            />
          </div>
          
          <input
            type="number"
            onKeyDown={bloquearLetras}
            value={atributosFinais[nome]}
            onChange={(e) => {
              const diferenca = atributosFinais[nome] - atributos[nome];
              setAtributos({ ...atributos, [nome]: Number(e.target.value) - diferenca });
            }}
            className={\`relative z-0 w-16 bg-transparent text-center text-[2rem] font-black outline-none \${atributosFinais[nome] > (atributos[nome] + bonusAtributos[nome]) ? 'text-green-500' : 'text-zinc-100'}\`}
          />
      </div>
    );
  };

  return (
    <div className="mb-6 mt-4 flex justify-center w-full">
      <div className="relative w-full max-w-[340px] aspect-square">
        <img src="/images/atributos-bg.png" alt="Atributos" className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
        
        {renderAtributo('AGI', 'top-[12%] left-[50%] -translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('INT', 'top-[39%] right-[11%] translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('VIG', 'top-[82%] right-[24%] translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('PRE', 'top-[82%] left-[24%] -translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('FOR', 'top-[39%] left-[11%] -translate-x-1/2 -translate-y-1/2')}
      </div>
    </div>
  );
}

`;

content = content.substring(0, start) + newFunction + content.substring(end);

fs.writeFileSync(file, content);
console.log('Replaced AtributosFicha');
