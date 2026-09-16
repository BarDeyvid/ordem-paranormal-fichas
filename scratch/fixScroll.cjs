const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

content = content.replace(
  `html {\n  scrollbar-gutter: stable;\n}`, // Just in case it already exists
  ``
);

content = content.replace(
  `:root {`,
  `html {
  scrollbar-gutter: stable;
}

:root {`
);

fs.writeFileSync('src/index.css', content);
console.log('Fixed scrollbar gutter globally');
