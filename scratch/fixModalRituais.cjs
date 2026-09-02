const fs = require('fs');

let file = 'src/components/ModalRituais.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize CRLF
content = content.replace(/\r\n/g, '\n');

const origBlock = `                          <span className="text-zinc-400">{ritual.Resistencia_Ritual.split('/')[0]}</span>
                          </div>
                        )}
                        </div>
                      </div>

                  </div>
                </Collapse>`;

const newBlock = `                          <span className="text-zinc-400">{ritual.Resistencia_Ritual.split('/')[0]}</span>
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

                  </div>
                </Collapse>`;

let matches = content.split(origBlock).length - 1;
console.log('Matches found for origBlock:', matches);
if (matches > 0) {
  content = content.split(origBlock).join(newBlock);
  fs.writeFileSync(file, content);
  console.log('Replaced correctly in ModalRituais.tsx!');
} else {
  // Let's try to find what it actually looks like
  console.log('Could not find origBlock! Let us check what is there.');
}
