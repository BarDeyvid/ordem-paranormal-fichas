const fs = require('fs');

function raiseBadge(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Modal files
  content = content.replace(
    /className="flex flex-col justify-between shrink-0 ml-2 items-end py-1"/g,
    'className="flex flex-col justify-between shrink-0 ml-2 items-end pb-1 pt-0 mt-[-4px]"'
  );

  // AbasPanel
  content = content.replace(
    /className=\{`flex flex-col justify-between shrink-0 ml-2 \$\{simboloImg \? 'items-end py-1' : 'items-end'\}`\}/g,
    'className={`flex flex-col justify-between shrink-0 ml-2 ${simboloImg ? \'items-end pb-1 pt-0 mt-[-4px]\' : \'items-end pb-1 pt-0 mt-[-4px]\'}`}'
  );

  fs.writeFileSync(file, content);
}

raiseBadge('src/components/ModalRituais.tsx');
raiseBadge('src/components/ModalRituaisExtra.tsx');
raiseBadge('src/screens/Ficha/AbasPanel.tsx');

console.log('Raised badges');
