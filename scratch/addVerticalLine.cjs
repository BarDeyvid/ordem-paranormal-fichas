const fs = require('fs');

function addVerticalLine(file) {
  let content = fs.readFileSync(file, 'utf8');

  // We find the block starting with {simboloImg && ( and ending with the corresponding )}
  const searchRegex = /\{simboloImg && \(\s*<div\s*className="overflow-hidden shrink-0 flex items-center justify-center"[\s\S]*?<img[\s\S]*?\/>\s*<\/div>\s*\)\}/;

  const replaceBlock = `{simboloImg && (
                                  <>
                                    <div
                                      className="overflow-hidden shrink-0 flex items-center justify-center"
                                      style={{
                                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                        width: expandido ? '0px' : '64px',
                                        height: '64px',
                                        marginTop: '-6px',
                                        marginBottom: '-6px',
                                        opacity: expandido ? 0 : 1,
                                      }}
                                    >
                                      <img
                                        src={simboloImg}
                                        loading="lazy"
                                        alt=""
                                        className="h-16 w-16 object-contain drop-shadow-md max-w-none"
                                      />
                                    </div>
                                    <div
                                      className="shrink-0 bg-white/20 rounded-full"
                                      style={{
                                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                        width: expandido ? '0px' : '1px',
                                        height: '36px',
                                        marginLeft: expandido ? '0px' : '10px',
                                        marginRight: expandido ? '0px' : '10px',
                                        opacity: expandido ? 0 : 1,
                                      }}
                                    />
                                  </>
                                )}`;

  if (content.match(searchRegex)) {
    content = content.replace(searchRegex, replaceBlock);
    fs.writeFileSync(file, content);
    console.log("Added vertical line to " + file);
  } else {
    console.log("Could not find image block in " + file);
  }
}

addVerticalLine('src/screens/Ficha/AbasPanel.tsx');
addVerticalLine('src/components/ModalRituais.tsx');
addVerticalLine('src/components/ModalRituaisExtra.tsx');
