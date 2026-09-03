const fs = require('fs');

function applyFix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace the previous scale animation with a simple fade
  const regex = /className=\{\`h-20 w-20 object-contain drop-shadow-md shrink-0 -my-3 transition-all duration-300 \$\{expandido \? 'scale-0 opacity-0' : 'scale-100 opacity-100'\}\`\}/g;
  const replacement = `className={\`h-20 w-20 object-contain drop-shadow-md shrink-0 -my-3 transition-opacity duration-200 \${expandido ? 'opacity-0' : 'opacity-100'}\`}`;

  if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log(`Successfully replaced in ${file}`);
  } else {
    console.log(`No match found in ${file}`);
  }
}

applyFix('src/screens/Ficha/AbasPanel.tsx');
applyFix('src/components/ModalRituais.tsx');
applyFix('src/components/ModalRituaisExtra.tsx');
