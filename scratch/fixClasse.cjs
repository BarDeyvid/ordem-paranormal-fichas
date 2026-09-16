const fs = require('fs');
let content = fs.readFileSync('src/screens/ClasseScreen.tsx', 'utf8');

// Replace Combatente
content = content.replace(
  /<p className="flex-grow text-sm leading-relaxed text-zinc-400">\s*Treinado para lutar com todo tipo de armas, e com a fora e a coragem\s*para encarar os perigos de frente\.\s*<\/p>/g,
  `<p className="flex-grow text-sm leading-relaxed text-zinc-400">
            Treinado para lutar com todo tipo de armas, e com a força e a coragem para encarar os perigos de frente, É o tipo de agente que prefere abordagens mais diretas e costuma atirar primeiro e perguntar depois.
          </p>`
);

content = content.replace(
  /<p className="flex-grow text-sm leading-relaxed text-zinc-400">\s*Treinado para lutar com todo tipo de armas, e com a for.a e a coragem\s*para encarar os perigos de frente\.\s*<\/p>/g,
  `<p className="flex-grow text-sm leading-relaxed text-zinc-400">
            Treinado para lutar com todo tipo de armas, e com a força e a coragem para encarar os perigos de frente, É o tipo de agente que prefere abordagens mais diretas e costuma atirar primeiro e perguntar depois.
          </p>`
);

// Especialista Color and Desc
content = content.replace(/border-amber-900\/60/g, 'border-green-900/60');
content = content.replace(/hover:border-amber-600/g, 'hover:border-green-700');
content = content.replace(/text-amber-400/g, 'text-green-500');
content = content.replace(/bg-amber-700/g, 'bg-green-800');
content = content.replace(/hover:bg-amber-600/g, 'hover:bg-green-700');
content = content.replace(/text-amber-300\/90/g, 'text-green-500'); // 'Perícias em dobro' text

content = content.replace(
  /<p className="flex-grow text-sm leading-relaxed text-zinc-400">\s*Um agente que confia mais em esperteza do que em fora bruta\.\s*<\/p>/g,
  `<p className="flex-grow text-sm leading-relaxed text-zinc-400">
            Um agente que confia mais em esperteza do que em força bruta. Um especialista se vale de conhecimento técnico, raciocínio rápido ou mesmo lábia para resolver mistérios e enfrentar o paranormal.
          </p>`
);
content = content.replace(
  /<p className="flex-grow text-sm leading-relaxed text-zinc-400">\s*Um agente que confia mais em esperteza do que em for.a bruta\.\s*<\/p>/g,
  `<p className="flex-grow text-sm leading-relaxed text-zinc-400">
            Um agente que confia mais em esperteza do que em força bruta. Um especialista se vale de conhecimento técnico, raciocínio rápido ou mesmo lábia para resolver mistérios e enfrentar o paranormal.
          </p>`
);


// Ocultista Color and Desc
content = content.replace(/border-zinc-600\/60/g, 'border-green-900/60');
content = content.replace(/hover:border-zinc-300/g, 'hover:border-green-700');
content = content.replace(/text-zinc-200/g, 'text-green-500'); // the title
content = content.replace(/bg-zinc-200/g, 'bg-green-800');
content = content.replace(/text-zinc-900/g, 'text-zinc-100'); // the button text color
content = content.replace(/hover:bg-white/g, 'hover:bg-green-700');
// The "Vontade & Ocultismo" box text
content = content.replace(/text-zinc-300">Vontade & Ocultismo<\/p>/g, 'text-green-500">Vontade & Ocultismo</p>');


content = content.replace(
  /<p className="flex-grow text-sm leading-relaxed text-zinc-400">\s*Muitos estudiosos das entidades se perdem em busca de poder\.\.\.\s*<\/p>/g,
  `<p className="flex-grow text-[13px] leading-relaxed text-zinc-400">
            O Outro Lado é misterioso, perigoso e, de certa forma, cativante. Muitos estudiosos das entidades se perdem em seus reinos obscuros em busca de poder, mas existem aqueles que visam compreender e dominar os mistérios paranormais para usá-los para combater o próprio Outro Lado. Esse tipo de agente não é apenas um conhecedor do oculto, como também possui talento para se conectar com elementos paranormais.
          </p>`
);


fs.writeFileSync('src/screens/ClasseScreen.tsx', content);
console.log('Fixed ClasseScreen descriptions and colors');
