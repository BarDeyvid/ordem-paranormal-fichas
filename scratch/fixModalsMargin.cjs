const fs = require('fs');

function fixModal(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /className="w-32 h-32 sm:w-40 sm:h-40 object-contain shrink-0 drop-shadow-lg"/g,
    'className="w-32 h-32 sm:w-40 sm:h-40 mr-2 sm:mr-6 object-contain shrink-0 drop-shadow-lg"'
  );
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}

fixModal('src/components/ModalRituais.tsx');
fixModal('src/components/ModalRituaisExtra.tsx');
