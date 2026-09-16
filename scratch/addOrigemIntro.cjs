const fs = require('fs');
let content = fs.readFileSync('src/screens/OrigensScreen.tsx', 'utf8');

const regex = /<p className="mb-4 border-b border-zinc-800 pb-4 text-sm uppercase tracking-widest text-green-600">\s*Passo 2 — Quem você era antes do Paranormal\s*<\/p>/;

const replace = `<p className="mb-4 border-b border-zinc-800 pb-4 text-sm uppercase tracking-widest text-green-600">
        Passo 2 — Quem você era antes do Paranormal
      </p>

      <div className="mb-6 text-sm leading-relaxed text-zinc-400">
        <p className="mb-2">
          O que seu personagem fazia antes de se envolver com o paranormal e ingressar na Ordem da Realidade? A origem representa como a vida pregressa influencia sua carreira de investigador. Escolha uma origem que se encaixe com o conceito de seu personagem.
        </p>
        <p className="mb-2 italic text-zinc-300">
          Ao escolher uma origem, você recebe duas perícias treinadas e um poder da origem.
        </p>
        <p>
          Cada origem apresentada a seguir é intencionalmente vaga, apenas uma ideia por onde começar. Você pode usá-la como está, para jogar rapidamente, ou colorir com quantos detalhes quiser, conforme o conceito de seu agente.
        </p>
      </div>`;

if (regex.test(content)) {
  content = content.replace(regex, replace);
  fs.writeFileSync('src/screens/OrigensScreen.tsx', content);
  console.log('Added intro text to OrigensScreen');
} else {
  console.log('Failed to find replace marker in OrigensScreen');
}
