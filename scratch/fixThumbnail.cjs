const fs = require('fs');
const file = 'src/screens/Ficha/AbasPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{simboloImg && !expandido && \(\s*<img\s*src=\{simboloImg\}\s*alt=""\s*className="h-20 w-20 object-contain drop-shadow-md shrink-0 -my-3"\s*\/>\s*\)\}/;

const replacement = `{simboloImg && (
                                  <div
                                    className="overflow-hidden shrink-0 flex items-center justify-center"
                                    style={{
                                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                      width: expandido ? '0px' : '80px',
                                      height: expandido ? '0px' : '80px',
                                      opacity: expandido ? 0 : 1,
                                      marginTop: expandido ? '0px' : '-12px',
                                      marginBottom: expandido ? '0px' : '-12px',
                                    }}
                                  >
                                    <img
                                      src={simboloImg}
                                      alt=""
                                      className="h-20 w-20 object-contain drop-shadow-md max-w-none"
                                    />
                                  </div>
                                )}`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
  console.log('Successfully replaced in AbasPanel.tsx');
} else {
  console.log('No match found in AbasPanel.tsx');
}
