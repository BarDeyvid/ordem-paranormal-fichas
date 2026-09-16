const fs = require('fs');
let c = fs.readFileSync('src/screens/Ficha/index.tsx', 'utf-8');
c = c.replace(
  "import { useRPG } from '../../context/RPGContext';",
  "import { useRPG } from '../../context/RPGContext';\\nimport { CustomSelect } from '../../components/CustomSelect';\\nimport { NEX_OPTIONS } from '../../utils/rpgRules';"
);
fs.writeFileSync('src/screens/Ficha/index.tsx', c, 'utf-8');
console.log('Success');
