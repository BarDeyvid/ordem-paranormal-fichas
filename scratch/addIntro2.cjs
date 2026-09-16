const fs = require('fs');
let content = fs.readFileSync('src/screens/ClasseScreen.tsx', 'utf8');

const regex = /<p className="mb-10 text-center text-sm uppercase tracking-widest text-green-600">\s*Passo 3 — Seu papel na Ordem\s*<\/p>/;

const replace = `<p className="mb-6 text-center text-sm uppercase tracking-widest text-green-600">
        Passo 3 — Seu papel na Ordem
      </p>

      <div className="mx-auto mb-10 max-w-4xl text-center text-sm leading-relaxed text-zinc-400">
        <p className="mb-2">
          Sua classe indica o treinamento que você recebeu na Ordem para enfrentar os perigos do Outro Lado. Em termos de jogo, é a sua característica mais importante, pois define o que você faz e qual é o seu papel no grupo de investigadores.
        </p>
        <p>
          Ordem Paranormal RPG contém três classes, que representam os principais arquétipos de heróis em histórias de terror e suspense:
        </p>
      </div>`;

content = content.replace(regex, replace);
fs.writeFileSync('src/screens/ClasseScreen.tsx', content);
console.log('Added intro via regex');
