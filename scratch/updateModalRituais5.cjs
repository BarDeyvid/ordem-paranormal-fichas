const fs = require('fs');
let content = fs.readFileSync('src/components/ModalRituais.tsx', 'utf8');

content = content.replace(
  /                      <\/div>\s*<span className="text-zinc-500 text-xs mt-1">{expandido \? '▲' : '▼'}<\/span>\s*<\/div>/g,
  `                      </div>
                      <div className="flex items-center gap-2.5">
                        {simboloImg && !expandido && (
                          <img
                            src={simboloImg}
                            alt=""
                            className="h-10 w-10 rounded object-contain opacity-70"
                            loading="lazy"
                          />
                        )}
                        <span className="text-zinc-500 text-xs mt-1">{expandido ? '▲' : '▼'}</span>
                      </div>
                    </div>`
);

fs.writeFileSync('src/components/ModalRituais.tsx', content);
console.log('Thumbnail added');
