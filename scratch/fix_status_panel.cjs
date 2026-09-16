const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/screens/Ficha/StatusPanel.tsx');
const contentLines = fs.readFileSync(filePath, 'utf-8').split('\\n');

// we want to remove lines 93 to 136 (inclusive) and replace with the new block
// in 0-indexed, that is 92 to 135. Let's verify line 93 is what we think it is.

const newContent = contentLines.slice(0, 92).join('\\n') + '\\n' +
`        {/* NÍVEL (regra NEX & EXPERIÊNCIA) */}
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
        )}` + '\\n' + contentLines.slice(136).join('\\n');

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Success by line index');
