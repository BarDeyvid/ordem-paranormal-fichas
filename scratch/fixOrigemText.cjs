const fs = require('fs');
let content = fs.readFileSync('src/screens/OrigensScreen.tsx', 'utf8');

const search = `<div className="mb-6 text-sm leading-relaxed text-zinc-400">
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

const replace = `<div className="mx-auto mb-8 max-w-4xl text-center text-sm leading-relaxed text-zinc-400">
        <p className="mb-2">
          O que seu personagem fazia antes de se envolver com o paranormal e ingressar na Ordem da Realidade? A origem representa como a vida pregressa influencia sua carreira de investigador. Escolha uma origem que se encaixe com o conceito de seu personagem.
        </p>
        <p className="mb-2 font-bold text-zinc-300">
          Ao escolher uma origem, você recebe duas perícias treinadas e um poder da origem.
        </p>
        <p>
          Cada origem apresentada a seguir é intencionalmente vaga, apenas uma ideia por onde começar. Você pode usá-la como está, para jogar rapidamente, ou colorir com quantos detalhes quiser, conforme o conceito de seu agente.
        </p>
      </div>`;

if (content.includes('italic text-zinc-300')) {
  content = content.replace(search, replace);
  
  // also center the title?
  // "e tenta deixar centralizado tbm"
  // The title "Escolha sua Origem" is not centered. I should center it to match ClasseScreen!
  content = content.replace(
    `<h1 className="font-display mb-2 text-3xl uppercase tracking-wide text-zinc-100">`,
    `<h1 className="font-display mb-2 text-center text-3xl uppercase tracking-wide text-zinc-100">`
  );
  content = content.replace(
    `<p className="mb-4 border-b border-zinc-800 pb-4 text-sm uppercase tracking-widest text-green-600">`,
    `<p className="mb-4 border-b border-zinc-800 pb-4 text-center text-sm uppercase tracking-widest text-green-600">`
  );

  fs.writeFileSync('src/screens/OrigensScreen.tsx', content);
  console.log('Fixed Origens text styling');
} else {
  console.log('Failed to find replace marker');
}
