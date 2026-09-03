const fs = require('fs');

function removeImgBlock(file) {
  let content = fs.readFileSync(file, 'utf8');

  const start = content.indexOf('{simboloImg && (');
  if (start !== -1) {
    const end = content.indexOf(')}', start + 1500) + 2;
    const block = content.substring(start, end);
    content = content.replace(block, '');
    fs.writeFileSync(file, content);
    console.log("Removed from " + file);
  }
}

removeImgBlock('src/components/ModalRituais.tsx');
removeImgBlock('src/components/ModalRituaisExtra.tsx');
