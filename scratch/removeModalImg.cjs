const fs = require('fs');

function removeImageFromHeader(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Regex to remove the {simboloImg && (...)} from the left side
  const searchImgBlock = /\{simboloImg && \(\s*<>\s*<div\s*className="overflow-hidden shrink-0 flex items-center justify-center"[\s\S]*?<\/div>\s*<div\s*className="shrink-0 bg-white\/20 rounded-full"[\s\S]*?<\/div>\s*<\/>\s*\)\}/;

  if (content.match(searchImgBlock)) {
    content = content.replace(searchImgBlock, '');
  } else {
    console.log("Could not find img block in " + file);
  }

  // Clean up relative items-stretch
  content = content.replace(/className=\{`flex justify-between gap-3 px-4 py-3 relative \$\{simboloImg \? 'items-stretch' : 'items-center'\}`\}/g, 'className="flex justify-between gap-3 px-4 py-3 relative items-center"');
  content = content.replace(/className="flex justify-between gap-3 px-4 py-3 cursor-pointer relative \$\{simboloImg \? 'items-stretch' : 'items-center'\}"/g, 'className="flex justify-between gap-3 px-4 py-3 cursor-pointer relative items-center"'); // for extra
  // And fix the right side: ${simboloImg ? 'items-end py-1' : 'items-end'} -> items-end
  content = content.replace(/className=\{`flex flex-col justify-between shrink-0 ml-2 \$\{simboloImg \? 'items-end py-1' : 'items-end'\}`\}/g, 'className="flex flex-col justify-between shrink-0 ml-2 items-end"');
  // And fix the arrow: ${simboloImg ? 'mt-auto' : 'mt-2'}
  content = content.replace(/className=\{`flex items-center gap-2 \$\{simboloImg \? 'mt-auto' : 'mt-2'\}`\}/g, 'className="flex items-center gap-2 mt-2"');

  fs.writeFileSync(file, content);
  console.log("Removed header image from " + file);
}

removeImageFromHeader('src/components/ModalRituais.tsx');
removeImageFromHeader('src/components/ModalRituaisExtra.tsx');
