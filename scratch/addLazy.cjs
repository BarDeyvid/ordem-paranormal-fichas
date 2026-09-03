const fs = require('fs');
['src/components/ModalRituais.tsx', 'src/components/ModalRituaisExtra.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('loading="lazy"')) {
    console.log(file, 'already has lazy');
  } else {
    content = content.replace(/<img([^>]*)src=\{simboloImg\}([^>]*)>/g, '<img$1src={simboloImg} loading="lazy"$2>');
    fs.writeFileSync(file, content);
    console.log(file, 'added lazy');
  }
});
