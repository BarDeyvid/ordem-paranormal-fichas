const fs = require('fs');
let content = fs.readFileSync('src/screens/AtributosScreen.tsx', 'utf8');

// Center titles
content = content.replace(
  /<h1 className="font-display mb-2 text-3xl uppercase tracking-wide text-zinc-100">/,
  `<h1 className="font-display mb-2 text-center text-3xl uppercase tracking-wide text-zinc-100">`
);

content = content.replace(
  /<p className="mb-8 border-b border-zinc-800 pb-4 text-sm uppercase tracking-widest text-green-600">/,
  `<p className="mb-4 border-b border-zinc-800 pb-4 text-center text-sm uppercase tracking-widest text-green-600">`
);

// Inject Top text
const topText = `
      <div className="mx-auto mb-6 max-w-4xl text-center text-sm leading-relaxed text-zinc-400">
        <p>
          Personagens de Ordem Paranormal RPG possuem cinco atributos, que definem suas competências básicas: Agilidade, Força, Intelecto, Presença e Vigor. Atributos são medidos numericamente. Um valor 1 representa a média humana. Valores 2 ou 3 estão acima da média — um atleta de elite e um pesquisador de renome podem ter Força ou Intelecto nesse intervalo. Valores 4 ou 5 representam indivíduos extraordinários — um medalhista olímpico ou vencedor do Nobel podem ter Força ou Intelecto nessa faixa. Já um valor 0 está abaixo da média — uma criança pode ter Força 0, enquanto um idoso de saúde frágil pode ter Vigor 0.
        </p>
      </div>`;

content = content.replace(
  /\{\/\* SELETOR DE NEX \*\/\}/,
  `${topText}\n\n      {/* SELETOR DE NEX */}`
);

// Inject Left text + wrap in flex
content = content.replace(
  /\{\/\* LISTA DE ATRIBUTOS \*\/\}\s*<div className="mb-10 mt-6 flex justify-center w-full">/,
  `{/* LISTA DE ATRIBUTOS E TEXTO */}
      <div className="mb-10 mt-6 flex flex-col md:flex-row items-center gap-10 w-full">
        <div className="flex-1 text-sm leading-relaxed text-zinc-400 text-left order-2 md:order-1">
          <p>
            Quando você cria um personagem, todos os seus atributos começam em 1 e você recebe 4 pontos para distribuir entre eles como quiser. Você também pode reduzir um atributo para 0 para receber 1 ponto adicional. O valor máximo inicial que você pode ter em cada atributo é 3.
          </p>
        </div>
        <div className="flex-1 flex justify-center order-1 md:order-2 w-full">`
);

// Expand max-w-2xl to max-w-5xl
content = content.replace(
  /<div className="mx-auto w-full max-w-2xl">/,
  `<div className="mx-auto w-full max-w-5xl">`
);

fs.writeFileSync('src/screens/AtributosScreen.tsx', content);
console.log('Added text to AtributosScreen');
