const fs = require('fs');
let file = 'src/screens/Ficha/AbasPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Render the size of the Map at the top of the AbasPanel rituals section!
content = content.replace(
  /<div className="flex flex-col gap-3">/,
  `<div className="flex flex-col gap-3">
                            <div className="bg-red-500 text-white p-2 text-xs">
                              DEBUG RITUAIS: {rituaisHook.simbolosRituais?.size || 0} símbolos carregados.
                              Exemplo de chave no mapa: {Array.from(rituaisHook.simbolosRituais?.keys() || [])[0]}
                            </div>`
);

fs.writeFileSync(file, content);
console.log('Injected debug overlay!');
