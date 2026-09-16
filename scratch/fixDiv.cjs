const fs = require('fs');
let content = fs.readFileSync('src/screens/AtributosScreen.tsx', 'utf8');

const search = `</div>
      </div>

      <button
        onClick={() => setTelaAtual('origens')}`;

const replace = `</div>
        </div>
      </div>

      <button
        onClick={() => setTelaAtual('origens')}`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/screens/AtributosScreen.tsx', content);
  console.log('Fixed missing div in AtributosScreen');
} else {
  console.log('Not found');
}
