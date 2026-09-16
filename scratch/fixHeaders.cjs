const fs = require('fs');

function formatHeader(title, subtitle, textContent) {
  return `<header className="mb-10 flex flex-col items-center text-center">
        <h1 className="font-display mb-2 text-3xl uppercase tracking-wide text-zinc-100">
          ${title}
        </h1>
        <p className="mb-6 text-sm uppercase tracking-widest text-green-500 font-bold">
          ${subtitle}
        </p>
        <div className="w-full max-w-3xl text-sm leading-relaxed text-zinc-400 space-y-4">
          ${textContent}
        </div>
        <div className="mt-8 h-px w-full max-w-5xl bg-zinc-800/80"></div>
      </header>`;
}

// 1. AtributosScreen.tsx
let attr = fs.readFileSync('src/screens/AtributosScreen.tsx', 'utf8');
const attrRegex = /<h1 className="font-display mb-2 text-center text-3xl uppercase tracking-wide text-zinc-100">[\s\S]*?<\/div>/;
attr = attr.replace(attrRegex, formatHeader(
  "Criação de Personagem",
  "Passo 1 — Atributos",
  `<p>Personagens de Ordem Paranormal RPG possuem cinco atributos, que definem suas competências básicas: Agilidade, Força, Intelecto, Presença e Vigor.</p><p>Atributos são medidos numericamente. Um valor 1 representa a média humana. Valores 2 ou 3 estão acima da média — um atleta de elite e um pesquisador de renome podem ter Força ou Intelecto nesse intervalo. Valores 4 ou 5 representam indivíduos extraordinários — um medalhista olímpico ou vencedor do Nobel podem ter Força ou Intelecto nessa faixa. Já um valor 0 está abaixo da média — uma criança pode ter Força 0, enquanto um idoso de saúde frágil pode ter Vigor 0.</p>`
));
fs.writeFileSync('src/screens/AtributosScreen.tsx', attr);

// 2. OrigensScreen.tsx
let orig = fs.readFileSync('src/screens/OrigensScreen.tsx', 'utf8');
const origRegex = /<h1 className="font-display mb-2 text-center text-3xl uppercase tracking-wide text-zinc-100">[\s\S]*?<\/div>/;
orig = orig.replace(origRegex, formatHeader(
  "Escolha sua Origem",
  "Passo 2 — Quem você era antes do Paranormal",
  `<p>O que seu personagem fazia antes de se envolver com o paranormal e ingressar na Ordem da Realidade? A origem representa como a vida pregressa influencia sua carreira de investigador. Escolha uma origem que se encaixe com o conceito de seu personagem.</p><p className="font-bold text-zinc-300">Ao escolher uma origem, você recebe duas perícias treinadas e um poder da origem.</p><p>Cada origem apresentada a seguir é intencionalmente vaga, apenas uma ideia por onde começar. Você pode usá-la como está, para jogar rapidamente, ou colorir com quantos detalhes quiser, conforme o conceito de seu agente.</p>`
));
fs.writeFileSync('src/screens/OrigensScreen.tsx', orig);

// 3. ClasseScreen.tsx
let clas = fs.readFileSync('src/screens/ClasseScreen.tsx', 'utf8');
const clasRegex = /<h1 className="font-display mb-2 text-center text-3xl uppercase tracking-wide text-zinc-100">[\s\S]*?<\/div>/;
clas = clas.replace(clasRegex, formatHeader(
  "Escolha sua Classe",
  "Passo 3 — Seu papel na Ordem",
  `<p>Sua classe indica o treinamento que você recebeu na Ordem para enfrentar os perigos do Outro Lado. Em termos de jogo, é a sua característica mais importante, pois define o que você faz e qual é o seu papel no grupo de investigadores.</p><p>Ordem Paranormal RPG contém três classes, que representam os principais arquétipos de heróis em histórias de terror e suspense:</p>`
));
fs.writeFileSync('src/screens/ClasseScreen.tsx', clas);

console.log('Fixed header layout for all screens');
