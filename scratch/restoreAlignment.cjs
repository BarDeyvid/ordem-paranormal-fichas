const fs = require('fs');

function restoreAlignment(file) {
  let content = fs.readFileSync(file, 'utf8');

  // We change the parent to items-stretch instead of items-center
  content = content.replace(
    'className="flex justify-between gap-3 px-4 py-3 relative items-center"',
    'className="flex justify-between gap-3 px-4 py-3 relative items-stretch"'
  );
  content = content.replace(
    'className="flex justify-between gap-3 px-4 py-3 cursor-pointer relative items-center"',
    'className="flex justify-between gap-3 px-4 py-3 cursor-pointer relative items-stretch"'
  );

  // We also make LADO DIREITO items-end py-1 again, and the bottom mt-auto
  content = content.replace(
    'className="flex flex-col justify-between shrink-0 ml-2 items-end"',
    'className="flex flex-col justify-between shrink-0 ml-2 items-end py-1"'
  );
  content = content.replace(
    'className="flex items-center gap-2 mt-2"',
    'className="flex items-center gap-2 mt-auto"'
  );

  fs.writeFileSync(file, content);
}

restoreAlignment('src/components/ModalRituais.tsx');
restoreAlignment('src/components/ModalRituaisExtra.tsx');
console.log('Restored alignment');
