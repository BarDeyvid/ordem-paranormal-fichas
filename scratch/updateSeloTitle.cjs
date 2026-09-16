const fs = require('fs');
let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

const searchStr = `<span className="font-bold text-sm text-zinc-100 truncate leading-none mt-0.5">{item.item.Nome_Ama}</span>`;
const replacement = `<span className="font-bold text-sm text-zinc-100 truncate leading-none mt-0.5">
              {item.item.Nome_Ama}
              {item.item.Nome_Ama === 'Selos Paranormais' && item.item.ritualSeloKey ? (() => {
                 const ritual = rituaisHook.rituaisAprendidos.find(r => \`\${r.Codigo_Ritual}_\${r.Origem}\` === item.item.ritualSeloKey);
                 return ritual ? \` (\${ritual.customNome || ritual.Nome_Ritual})\` : '';
              })() : ''}
            </span>`;

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replacement);
  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Title updated.');
} else {
  console.log('Search string not found.');
}
