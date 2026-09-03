const fs = require('fs');
function shrinkImage(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/width: expandido \? '0px' : '80px'/g, "width: expandido ? '0px' : '64px'");
  content = content.replace(/height: '80px'/g, "height: '64px'");
  content = content.replace(/marginTop: '-12px'/g, "marginTop: '-6px'");
  content = content.replace(/marginBottom: '-12px'/g, "marginBottom: '-6px'");
  content = content.replace(/className="h-20 w-20/g, 'className="h-16 w-16');

  fs.writeFileSync(file, content);
  console.log(`Shrunk image in ${file}`);
}
shrinkImage('src/screens/Ficha/AbasPanel.tsx');
shrinkImage('src/components/ModalRituais.tsx');
shrinkImage('src/components/ModalRituaisExtra.tsx');
