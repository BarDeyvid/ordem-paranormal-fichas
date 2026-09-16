const fs = require('fs');
let content = fs.readFileSync('src/screens/ClasseScreen.tsx', 'utf8');

content = content.replace(
  `<div className="my-5 flex min-h-[102px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-sm font-bold text-green-500">Perícias em dobro</p>
          </div>`,
  `<div className="my-5 flex min-h-[102px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-sm text-zinc-500 italic">Nenhuma perícia padrão</p>
          </div>`
);

content = content.replace(
  `<div className="my-5 flex min-h-[102px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-sm font-bold text-green-500">Vontade & Ocultismo</p>
          </div>`,
  `<div className="my-5 flex min-h-[102px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 text-sm">
            <div className="flex items-center justify-center gap-3">
              <span>Vontade</span>
              <span className="text-zinc-600">&</span>
              <span>Ocultismo</span>
            </div>
          </div>`
);


fs.writeFileSync('src/screens/ClasseScreen.tsx', content);
console.log('Fixed Specialist and Ocultist skills');
