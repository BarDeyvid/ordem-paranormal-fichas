const fs = require('fs');
let content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');

const headerBlockRegex = /\{hab\.automatico && \([\s\S]*?<\/span>\s*\n\s*\)\}/;

if (headerBlockRegex.test(content)) {
  content = content.replace(headerBlockRegex, '');
  fs.writeFileSync('src/screens/Ficha/AbasPanel.tsx', content);
  console.log('Removed from header');
} else {
  console.log('Not found in header');
}
