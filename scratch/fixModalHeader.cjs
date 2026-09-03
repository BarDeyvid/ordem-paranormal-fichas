const fs = require('fs');

function fixModalHeader(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Change the header wrapper to items-center
  content = content.replace(
    'className="flex justify-between gap-3 px-4 py-3 relative items-stretch"',
    'className="flex justify-between gap-3 px-4 py-3 relative items-center"'
  );
  content = content.replace(
    'className="flex justify-between gap-3 px-4 py-3 cursor-pointer relative items-stretch"',
    'className="flex justify-between gap-3 px-4 py-3 cursor-pointer relative items-center"'
  );

  // Change the right side (LADO DIREITO) to just a horizontal flex
  content = content.replace(
    /className="flex flex-col justify-between shrink-0 ml-2 items-end pb-1 pt-0 mt-\[-4px\]"/g,
    'className="flex items-center shrink-0 ml-2 gap-3"'
  );

  // Remove the wrapper around the arrow since the parent is already flex items-center
  content = content.replace(
    /<div className="flex items-center gap-2 mt-auto">\s*<span className="text-zinc-500 text-xs ml-1">\{expandido \? '▲' : '▼'\}<\/span>\s*<\/div>/g,
    '<span className="text-zinc-500 text-xs">{expandido ? \'▲\' : \'▼\'}</span>'
  );

  fs.writeFileSync(file, content);
}

fixModalHeader('src/components/ModalRituais.tsx');
fixModalHeader('src/components/ModalRituaisExtra.tsx');
console.log('Fixed Modal Headers');
