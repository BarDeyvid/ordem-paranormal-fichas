const fs = require('fs');

const updateLabels = (filePath) => {
  let c = fs.readFileSync(filePath, 'utf8');

  // Fix mapping to remove "Ritual: " prefix
  c = c.replace(/return \{ id: mid, municao: \{ Nome_Item: "Ritual: " \+ match\[2\] \}, isRitual: true, elemento: match\[1\] \};/g,
                `return { id: mid, municao: { Nome_Item: match[2] }, isRitual: true, elemento: match[1] };`);
  c = c.replace(/return \{ id: mid, municao: \{ Nome_Item: "Ritual: " \+ mid\.substring\(7\) \} \};/g,
                `return { id: mid, municao: { Nome_Item: mid.substring(7) }, isRitual: true };`);

  // Fix CombatePanel render
  if (filePath.includes('CombatePanel')) {
    c = c.replace(/<span className="font-bold text-green-400">Munio:<\/span>/g,
                  `<span className="font-bold text-green-400">{municoesAcopladasList[0]?.isRitual ? 'Ritual:' : 'Munição:'}</span>`);
    c = c.replace(/<span className="font-bold text-green-400">Munição:<\/span>/g,
                  `<span className="font-bold text-green-400">{municoesAcopladasList[0]?.isRitual ? 'Ritual:' : 'Munição:'}</span>`);
    // encoding safe
    c = c.replace(/<span className="font-bold text-green-400">Muniǜo:<\/span>/g,
                  `<span className="font-bold text-green-400">{municoesAcopladasList[0]?.isRitual ? 'Ritual:' : 'Munição:'}</span>`);
  }

  // Fix InventarioPanel render
  if (filePath.includes('InventarioPanel')) {
    c = c.replace(/<span className="text-\[10px\] font-bold uppercase tracking-wider text-zinc-500">Munies:<\/span>/g,
                  `<span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{municoesAcopladasList[0]?.isRitual ? 'Rituais:' : 'Munições:'}</span>`);
    c = c.replace(/<span className="text-\[10px\] font-bold uppercase tracking-wider text-zinc-500">Munições:<\/span>/g,
                  `<span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{municoesAcopladasList[0]?.isRitual ? 'Rituais:' : 'Munições:'}</span>`);
    // encoding safe
    c = c.replace(/<span className="text-\[10px\] font-bold uppercase tracking-wider text-zinc-500">Munies:<\/span>/g,
                  `<span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{municoesAcopladasList[0]?.isRitual ? 'Rituais:' : 'Munições:'}</span>`);
  }

  fs.writeFileSync(filePath, c);
};

updateLabels('src/screens/Ficha/CombatePanel.tsx');
updateLabels('src/screens/Ficha/InventarioPanel.tsx');
