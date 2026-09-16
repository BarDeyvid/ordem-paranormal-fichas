const fs = require('fs');
let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

const searchStr = `<div className="flex flex-col gap-2 mt-1">
                    <div className="flex justify-between items-center bg-zinc-900 rounded p-1.5 border border-zinc-800">`;

const replacement = `<div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-zinc-100">{ritual.customNome || ritual.Nome_Ritual}</h4>
                    </div>
                    <div className="flex justify-between items-center bg-zinc-900 rounded p-1.5 border border-zinc-800">`;

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replacement);
  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Added ritual name block');
} else {
  console.log('Search string not found for ritual block.');
}
