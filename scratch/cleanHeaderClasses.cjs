const fs = require('fs');

function cleanHeader(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Let's replace the dynamic classes with static classes
  content = content.replace(/className=\{`flex justify-between gap-3 px-4 py-3 relative \$\{simboloImg \? 'items-stretch' : 'items-center'\}`\}/g, 'className="flex justify-between gap-3 px-4 py-3 relative items-center"');
  
  content = content.replace(/className=\{`flex justify-between gap-3 px-4 py-3 cursor-pointer relative \$\{simboloImg \? 'items-stretch' : 'items-center'\}`\}/g, 'className="flex justify-between gap-3 px-4 py-3 cursor-pointer relative items-center"');
  
  content = content.replace(/className=\{`flex flex-col justify-between shrink-0 ml-2 \$\{simboloImg \? 'items-end py-1' : 'items-end'\}`\}/g, 'className="flex flex-col justify-between shrink-0 ml-2 items-end"');
  
  content = content.replace(/className=\{`flex items-center gap-2 \$\{simboloImg \? 'mt-auto' : 'mt-2'\}`\}/g, 'className="flex items-center gap-2 mt-2"');

  fs.writeFileSync(file, content);
}

cleanHeader('src/components/ModalRituais.tsx');
cleanHeader('src/components/ModalRituaisExtra.tsx');
console.log('Cleaned classes');
