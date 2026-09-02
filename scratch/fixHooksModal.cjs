const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add import if not present
  if (!content.includes("import { useRPG } from '../context/RPGContext';")) {
    content = content.replace(
      "import type { Ritual",
      "import { useRPG } from '../context/RPGContext';\nimport type { Ritual"
    );
  }

  // Add hook call inside component
  const componentMatch = content.match(/export const (ModalRituais|ModalRituaisExtra): React\.FC<[^>]+> = \([^)]+\) => {/);
  if (componentMatch && !content.includes("const { rituaisHook } = useRPG();")) {
    content = content.replace(
      componentMatch[0],
      componentMatch[0] + "\n  const { rituaisHook } = useRPG();"
    );
  }

  fs.writeFileSync(file, content);
}

fixFile('src/components/ModalRituais.tsx');
fixFile('src/components/ModalRituaisExtra.tsx');
console.log('Fixed hook missing reference');
