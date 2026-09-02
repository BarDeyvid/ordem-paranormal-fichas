const fs = require('fs');

function fixLayout(file, isModal) {
  let content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

  // FIRST, let's normalize everything to a safe state by removing any existing {simboloImg && ...} in the expanded area.
  // This is tricky because we might have added it incorrectly.
  // Instead, let's replace the ENTIRE metadata block with a fresh, perfect one.

  const blockRegex = isModal 
    ? /<div className="mb-[23] flex (?:flex-col|gap-4 items-center)[\s\S]*?\{ritual\.Resistencia_Ritual.*<\/div>\}(?:\s*<\/div>\s*\{simboloImg && \([\s\S]*?<\/[iI]mg>\s*\)\})?\s*<\/div>/g
    : /<div className="mb-4 flex (?:flex-col|gap-4 items-center)[\s\S]*?\{dados.*<\/div>\}(?:\s*<\/div>\s*\{simboloImg && \([\s\S]*?<\/[iI]mg>\s*\)\})?\s*<\/div>/g;

  content = content.replace(blockRegex, (match) => {
    // Determine what text fields we have in this match
    let textFields = '';
    if (isModal) {
      textFields = `
                          {ritual.Execucao_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Execução: </span><span className="text-zinc-300">{ritual.Execucao_Ritual${file.includes('Extra') ? '' : '?.split(\'/\')[0].trim()'}}</span></div>}
                          {ritual.Alcance_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Alcance: </span><span className="text-zinc-300">{ritual.Alcance_Ritual${file.includes('Extra') ? '' : '?.split(\'/\')[0].trim()'}}</span></div>}
                          {ritual.Area_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Área: </span><span className="text-zinc-300">{ritual.Area_Ritual${file.includes('Extra') ? '' : '?.split(\'/\')[0].trim()'}}</span></div>}
                          {ritual.Alvo_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Alvo: </span><span className="text-zinc-300">{ritual.Alvo_Ritual${file.includes('Extra') ? '' : '?.split(\'/\')[0].trim()'}}</span></div>}
                          {ritual.Duracao_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Duração: </span><span className="text-zinc-300">{ritual.Duracao_Ritual${file.includes('Extra') ? '' : '?.split(\'/\')[0].trim()'}}</span></div>}
                          {ritual.Efeito_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Efeito: </span><span className="text-zinc-300">{ritual.Efeito_Ritual${file.includes('Extra') ? '' : '?.split(\'/\')[0].trim()'}}</span></div>}
                          {ritual.Resistencia_Ritual && <div className="text-xs"><span className="font-bold text-zinc-500">Resistência: </span><span className="text-zinc-300">{ritual.Resistencia_Ritual${file.includes('Extra') ? '' : '?.split(\'/\')[0].trim()'}}</span></div>}`;
    } else {
      textFields = `
                                    {execucao && (
                                      <div className="text-xs">
                                        <span className="font-bold text-zinc-300">Execução: </span>
                                        <span className="text-zinc-400">{execucao}</span>
                                      </div>
                                    )}
                                    {alcance && (
                                      <div className="text-xs">
                                        <span className="font-bold text-zinc-300">Alcance: </span>
                                        <span className="text-zinc-400">{alcance}</span>
                                      </div>
                                    )}
                                    {area && (
                                      <div className="text-xs">
                                        <span className="font-bold text-zinc-300">Área: </span>
                                        <span className="text-zinc-400">{area}</span>
                                      </div>
                                    )}
                                    {alvo && (
                                      <div className="text-xs">
                                        <span className="font-bold text-zinc-300">Alvo: </span>
                                        <span className="text-zinc-400">{alvo}</span>
                                      </div>
                                    )}
                                    {duracao && (
                                      <div className="text-xs">
                                        <span className="font-bold text-zinc-300">Duração: </span>
                                        <span className="text-zinc-400">{duracao}</span>
                                      </div>
                                    )}
                                    {efeito && (
                                      <div className="text-xs">
                                        <span className="font-bold text-zinc-300">Efeito: </span>
                                        <span className="text-zinc-400">{efeito}</span>
                                      </div>
                                    )}
                                    {resistencia && (
                                      <div className="text-xs">
                                        <span className="font-bold text-zinc-300">Resistência: </span>
                                        <span className="text-zinc-400">{resistencia}</span>
                                      </div>
                                    )}
                                    {dados && (
                                      <div className="text-xs">
                                        <span className="font-bold text-zinc-300">Dados: </span>
                                        <span className="text-zinc-400">{dados}</span>
                                      </div>
                                    )}`;
    }

    const padding = isModal ? 'mb-3 border-b border-zinc-800/50 pb-3' : 'mb-4';
    const imageClass = isModal ? 'w-32 h-32 sm:w-40 sm:h-40' : 'w-40 h-40 sm:w-48 sm:h-48';

    return `<div className="${padding} flex flex-row items-center justify-between gap-4">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
${textFields}
      </div>
      {simboloImg && (
        <img
          src={simboloImg}
          alt=""
          className="${imageClass} object-contain shrink-0 drop-shadow-lg"
        />
      )}
    </div>`;
  });

  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
}

fixLayout('src/components/ModalRituais.tsx', true);
fixLayout('src/components/ModalRituaisExtra.tsx', true);
fixLayout('src/screens/Ficha/AbasPanel.tsx', false);
