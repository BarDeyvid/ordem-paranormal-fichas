const fs = require('fs');
let content = fs.readFileSync('src/components/SortableItemAmaldicoado.tsx', 'utf8');

const search = `                return (
                  <div className="flex flex-col gap-2 mt-1">`;

const replace = `                return (
                  <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-zinc-800/50">`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/components/SortableItemAmaldicoado.tsx', content);
  console.log('Fixed block wrap');
} else {
  console.log('Not found');
}
