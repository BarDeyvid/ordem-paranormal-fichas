const fs = require('fs');
let content = fs.readFileSync('src/screens/AtributosScreen.tsx', 'utf8');

const regex = /<\/div>\s*<\/div>\s*<button\s*onClick=\{\(\) => setTelaAtual\('origens'\)\}/;

const replace = `</div>
        </div>
      </div>

      <button
        onClick={() => setTelaAtual('origens')}`;

if (regex.test(content)) {
  content = content.replace(regex, replace);
  fs.writeFileSync('src/screens/AtributosScreen.tsx', content);
  console.log('Fixed missing div via regex');
} else {
  console.log('Not found via regex');
}
