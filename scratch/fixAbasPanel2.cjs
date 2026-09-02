const fs = require('fs');

let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');

const poderesGeraisMapString = `
  const poderesGeraisMap = React.useMemo(() => {
    const map = new Map<string, string | null>();
    listaPoderesUtilidade.forEach(p => {
      map.set(p.Nome.toLowerCase().trim(), p.Automatico ?? null);
    });
    poderesClasse.forEach(p => {
      map.set(p.Nome.toLowerCase().trim(), p.Automatico ?? null);
    });
    return map;
  }, [listaPoderesUtilidade, poderesClasse]);
`;

// Insert the new map
if (!content.includes('poderesGeraisMap')) {
  content = content.replace('}, [poderesParanormais]);', '}, [poderesParanormais]);\n' + poderesGeraisMapString);
}

// Global replace using Regex to handle possible whitespace differences
const regex = /const automaticoVal = pp \? \(afinidadeAtiva \? \(pp\['Automatico\?_Afinidade'\] \?\? pp\['Automatico\?'\]\) : pp\['Automatico\?'\]\) : undefined;/g;
const newAutomaticoValStr = "const automaticoVal = pp ? (afinidadeAtiva ? (pp['Automatico?_Afinidade'] ?? pp['Automatico?']) : pp['Automatico?']) : (poderesGeraisMap.get(nomeBaseCheck) || undefined);";

content = content.replace(regex, newAutomaticoValStr);

fs.writeFileSync('src/screens/Ficha/AbasPanel.tsx', content);
