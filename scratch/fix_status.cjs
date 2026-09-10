const fs = require('fs');

const file = 'src/screens/Ficha/StatusPanel.tsx';
let c = fs.readFileSync(file, 'utf-8');

const s1 = c.indexOf('{/* NEX / NÍVEL (regra NEX & EXPERIÊNCIA) */}');
const s2 = c.indexOf('{/* PE/TURNO */}');

if (s1 !== -1 && s2 !== -1) {
  const newText = `{/* NÍVEL (se regra ativa) */}
        {regraNexExperiencia && (
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative z-50 w-full">
              <CustomSelect
                value={nivel.toString()}
                onChange={(val) => setNivel(Number(val))}
                options={NIVEL_OPTIONS.map(n => ({ value: n.toString(), label: n.toString() }))}
                wrapperClassName="w-20"
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nível</span>
          </div>
        )}

        `;
  
  const finalC = c.substring(0, s1) + newText + c.substring(s2);
  fs.writeFileSync(file, finalC, 'utf-8');
  console.log('Success split replace');
} else {
  console.log('Not found strings');
}
