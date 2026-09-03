const fs = require('fs');

function applyFix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Regex to match the complex wrapper I added in the previous step
  const regex = /\{simboloImg && \(\s*<div\s*className="overflow-hidden shrink-0 flex items-center justify-center"\s*style=\{\{[\s\S]*?\}\}\s*>\s*<img\s*src=\{simboloImg\}\s*alt=""\s*className="h-20 w-20 object-contain drop-shadow-md max-w-none"\s*\/>\s*<\/div>\s*\)\}/g;

  // Replacement: just the image, but with scale and opacity transitions, leaving it in the DOM to preserve header height.
  const replacement = `{simboloImg && (
                                  <img
                                    src={simboloImg}
                                    alt=""
                                    className={\`h-20 w-20 object-contain drop-shadow-md shrink-0 -my-3 transition-all duration-300 \${expandido ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}\`}
                                  />
                                )}`;

  if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log(`Successfully replaced in ${file}`);
  } else {
    console.log(`No match found in ${file}`);
  }
}

applyFix('src/screens/Ficha/AbasPanel.tsx');
applyFix('src/components/ModalRituais.tsx');
applyFix('src/components/ModalRituaisExtra.tsx');
