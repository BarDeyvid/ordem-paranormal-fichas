const fs = require('fs');

function applyToModalRituais(file, isExtra) {
  let content = fs.readFileSync(file, 'utf8');

  // Normalize CRLF
  content = content.replace(/\r\n/g, '\n');

  // We want to replace the block starting at: <div className="mb-X flex flex-col gap-1 border-b border-zinc-800/50 pb-3">
  // until </Collapse> which follows Resistencia_Ritual

  let origBlockRegex = /<div className="mb-[23] flex flex-col gap-1 border-b border-zinc-800\/50 pb-3">\s*\{ritual\.Execucao_Ritual[\s\S]*?\{ritual\.Resistencia_Ritual[^<]*<div className="text-xs"><span className="font-bold text-zinc-500">Resistência: <\/span><span className="text-zinc-300">\{ritual\.Resistencia_Ritual(?:\?\.split\('\/'\)\[0\]\.trim\(\))?\}<\/span><\/div>\}\s*<\/div>\s*<\/Collapse>/g;
  
  // Wait, ModalRituais is called TWICE (for col 1 and col 2)
  let count = (content.match(origBlockRegex) || []).length;
  console.log(`Found ${count} matches in ${file}`);

  if (count > 0) {
    content = content.replace(origBlockRegex, (match) => {
      // replace the first div
      let newMatch = match.replace(
        /<div className="mb-[23] flex flex-col gap-1 border-b border-zinc-800\/50 pb-3">/,
        `<div className="mb-3 flex gap-4 items-center border-b border-zinc-800/50 pb-3">
                        <div className="flex flex-col gap-1 flex-1">`
      );
      
      // now find the ending </div>\s*</Collapse>
      newMatch = newMatch.replace(
        /<\/div>\s*<\/Collapse>$/,
        `</div>
                        {simboloImg && (
                          <img
                            src={simboloImg}
                            alt=""
                            className="w-48 h-48 object-contain shrink-0 drop-shadow-lg"
                          />
                        )}
                      </div>
                    </Collapse>`
      );
      
      return newMatch;
    });

    fs.writeFileSync(file, content);
    console.log(`Replaced correctly in ${file}!`);
  } else {
    console.log(`Could not find origBlock in ${file}!`);
  }
}

applyToModalRituais('src/components/ModalRituais.tsx', false);
applyToModalRituais('src/components/ModalRituaisExtra.tsx', true);
