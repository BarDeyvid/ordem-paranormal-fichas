const fs = require('fs');

function updateFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  // 1. Update expanded container alignment (items-start -> items-center) only for the specific gap-4 mb-3/4 divs
  content = content.replace(
    /<div className="mb-4 flex gap-4 items-start">/g,
    '<div className="mb-4 flex gap-4 items-center">'
  );
  content = content.replace(
    /<div className="mb-3 flex gap-4 items-start">/g,
    '<div className="mb-3 flex gap-4 items-center">'
  );
  content = content.replace(
    /<div className="flex gap-4 mb-3 border-b border-zinc-800\/50 pb-3 items-start">/g,
    '<div className="flex gap-4 mb-3 border-b border-zinc-800/50 pb-3 items-center">'
  );
  content = content.replace(
    /<div className="flex gap-4 mb-4 items-start">/g,
    '<div className="flex gap-4 mb-4 items-center">'
  );

  // 2. Update collapsed image size (h-16 w-16 -> h-20 w-20)
  content = content.replace(
    /className="h-16 w-16 object-contain drop-shadow-md"/g, // wait, did it have shrink-0?
    'className="h-24 w-24 object-contain drop-shadow-md shrink-0 -my-2"'
  );
  content = content.replace(
    /className="h-16 w-16 object-contain drop-shadow-md shrink-0"/g,
    'className="h-24 w-24 object-contain drop-shadow-md shrink-0 -my-2"'
  );

  // 3. Update expanded image size and position (w-32 h-32 -> w-48 h-48 mr-4 -mt-2)
  content = content.replace(
    /className="w-32 h-32 object-contain shrink-0 drop-shadow-lg"/g,
    'className="w-48 h-48 object-contain shrink-0 drop-shadow-lg mr-4 -mt-2"'
  );

  fs.writeFileSync(filename, content);
}

updateFile('src/screens/Ficha/AbasPanel.tsx');
updateFile('src/components/ModalRituais.tsx');
updateFile('src/components/ModalRituaisExtra.tsx');
console.log('Done specific replacements!');
