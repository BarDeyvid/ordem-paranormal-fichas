const fs = require('fs');

// Fix AbasPanel.tsx
let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');
content = content.replace(
  '<div className="mb-4 flex flex-col gap-1">',
  '<div className="mb-4 flex gap-4 items-center">\n<div className="flex flex-col gap-1 flex-1">'
);
fs.writeFileSync('src/screens/Ficha/AbasPanel.tsx', content);

// Fix ModalRituaisExtra.tsx
let extra = fs.readFileSync('src/components/ModalRituaisExtra.tsx', 'utf8');
extra = extra.split('<div className="mb-3 flex flex-col gap-1 border-b border-zinc-800/50 pb-3">').join(
  '<div className="mb-3 flex gap-4 items-center border-b border-zinc-800/50 pb-3">\n<div className="flex flex-col gap-1 flex-1">'
);
fs.writeFileSync('src/components/ModalRituaisExtra.tsx', extra);
console.log('Fixed opening divs!');
