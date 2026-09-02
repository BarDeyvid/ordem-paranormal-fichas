const fs = require('fs');

let file = 'src/screens/Ficha/AbasPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize CRLF
content = content.replace(/\r\n/g, '\n');

const origBlock = `                                  {dados && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Dados: </span>
                                      <span className="text-zinc-400">{dados}</span>
                                    </div>
                                  )}
                                </div>

                              </div>
                            </Collapse>`;

const newBlock = `                                  {dados && (
                                    <div className="text-xs">
                                      <span className="font-bold text-zinc-300">Dados: </span>
                                      <span className="text-zinc-400">{dados}</span>
                                    </div>
                                  )}
                                  </div>
                                  {simboloImg && (
                                    <img
                                      src={simboloImg}
                                      alt=""
                                      className="w-48 h-48 object-contain shrink-0 drop-shadow-lg"
                                    />
                                  )}
                                </div>

                              </div>
                            </Collapse>`;

if (content.includes(origBlock)) {
  content = content.replace(origBlock, newBlock);
  fs.writeFileSync(file, content);
  console.log('Successfully replaced expanded block in AbasPanel!');
} else {
  console.log('Could not find original block in AbasPanel!');
}
