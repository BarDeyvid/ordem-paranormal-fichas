const fs = require('fs');
let c = fs.readFileSync('src/screens/Ficha/index.tsx', 'utf-8');

const target = `  return (
    <div className="mb-10 mt-6 flex justify-center w-full">
      <div className="relative w-full max-w-[340px] aspect-square">
        <img src="/images/atributos-bg.png" alt="Atributos" className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
        
        {renderAtributo('AGI', 'top-[16%] left-[50%] -translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('INT', 'top-[36%] right-[19%] translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('VIG', 'top-[74%] right-[28%] translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('PRE', 'top-[74%] left-[27%] -translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('FOR', 'top-[36%] left-[19%] -translate-x-1/2 -translate-y-1/2')}
      </div>
    </div>
  );`;

const newCode = `  return (
    <div className="mb-10 mt-6 flex justify-center w-full relative">
      <div className="absolute top-0 left-0 md:left-4 z-10 flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-lg">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">NEX:</span>
        {regras['nex_experiencia'] ? (
          <div className="flex items-center w-16">
            <input
              type="number"
              onKeyDown={bloquearLetras}
              value={nex}
              onChange={(e) => setNex(Math.max(0, Math.min(99, Number(e.target.value))))}
              className="w-8 bg-transparent text-center text-sm font-bold text-zinc-100 outline-none"
            />
            <span className="text-sm font-bold text-zinc-500">%</span>
          </div>
        ) : (
          <div className="relative z-50 w-20">
            <CustomSelect
              value={nex.toString()}
              onChange={(val) => setNex(Number(val))}
              options={NEX_OPTIONS.map(n => ({ value: n.toString(), label: n + '%' }))}
              hideIcon={true}
              wrapperClassName="w-full"
              className="w-full bg-transparent border-none text-center text-sm font-bold text-zinc-100 hover:text-green-400 p-0 focus:ring-0 cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="relative w-full max-w-[340px] aspect-square">
        <img src="/images/atributos-bg.png" alt="Atributos" className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
        
        {renderAtributo('AGI', 'top-[16%] left-[50%] -translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('INT', 'top-[36%] right-[19%] translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('VIG', 'top-[74%] right-[28%] translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('PRE', 'top-[74%] left-[27%] -translate-x-1/2 -translate-y-1/2')}
        {renderAtributo('FOR', 'top-[36%] left-[19%] -translate-x-1/2 -translate-y-1/2')}
      </div>
    </div>
  );`;

c = c.replace(target, newCode);
fs.writeFileSync('src/screens/Ficha/index.tsx', c, 'utf-8');
console.log('Success return');
