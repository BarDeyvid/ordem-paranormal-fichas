const fs = require('fs');

function fixSlidingAnimation(file) {
  let content = fs.readFileSync(file, 'utf8');

  // We are looking for the <div className="flex items-center gap-3"> that contains the image
  const regex = /<div className="flex items-center gap-3">\s*\{simboloImg && \(\s*<img[\s\S]*?className=\{`h-20 w-20 object-contain drop-shadow-md shrink-0 -my-3 transition-opacity duration-200 \$\{expandido \? 'opacity-0' : 'opacity-100'\}`\}\s*\/>\s*\)\}/;

  const match = content.match(regex);
  if (!match) {
    console.log(`Could not find the block in ${file}`);
    return;
  }

  const replacement = `<div className="flex items-center">
                                {simboloImg && (
                                  <div
                                    className="overflow-hidden shrink-0 flex items-center justify-center"
                                    style={{
                                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                      width: expandido ? '0px' : '80px',
                                      height: '80px',
                                      marginTop: '-12px',
                                      marginBottom: '-12px',
                                      marginRight: expandido ? '0px' : '12px',
                                      opacity: expandido ? 0 : 1,
                                    }}
                                  >
                                    <img
                                      src={simboloImg}
                                      loading="lazy"
                                      alt=""
                                      className="h-20 w-20 object-contain drop-shadow-md max-w-none"
                                    />
                                  </div>
                                )}`;

  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
  console.log(`Fixed sliding animation in ${file}`);
}

fixSlidingAnimation('src/screens/Ficha/AbasPanel.tsx');
fixSlidingAnimation('src/components/ModalRituais.tsx');
fixSlidingAnimation('src/components/ModalRituaisExtra.tsx');
