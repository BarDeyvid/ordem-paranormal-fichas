const fs = require('fs');

const filesToFix = [
  'src/components/ModalPoderes.tsx',
  'src/components/ModalPoderesExtra.tsx',
  'src/components/ModalPoderOutraClasse.tsx',
  'src/screens/Ficha/AbasPanel.tsx',
];

filesToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // We are checking for 'Sim' or 'Semi'
  // I will replace `automaticoVal === 'Sim'` with `automaticoVal.toLowerCase().trim() === 'sim'`
  content = content.replace(/automaticoVal === 'Sim'/g, "automaticoVal.toLowerCase().trim() === 'sim'");
  // For ModalPoderOutraClasse:
  content = content.replace(/poder\.Automatico === 'Sim'/g, "poder.Automatico.toLowerCase().trim() === 'sim'");

  fs.writeFileSync(file, content);
});
