const fs = require('fs');

let content = fs.readFileSync('src/components/ModalPoderes.tsx', 'utf8');

// In poder object construction
content = content.replace(
  "Codigo_Regra: poder.Codigo_Regra,",
  "Codigo_Regra: poder.Codigo_Regra,\n                    Automatico: (poder as any).Automatico,"
);

// In paranormalData object construction
content = content.replace(
  "Pre_Codigo_Afinidade: pp.Pre_Codigo_Afinidade,",
  "Pre_Codigo_Afinidade: pp.Pre_Codigo_Afinidade,\n                    'Automatico?': pp['Automatico?'],\n                    'Automatico?_Afinidade': pp['Automatico?_Afinidade'],"
);

fs.writeFileSync('src/components/ModalPoderes.tsx', content);
