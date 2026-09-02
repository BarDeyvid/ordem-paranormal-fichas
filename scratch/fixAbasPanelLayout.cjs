const fs = require('fs');

let file = 'src/screens/Ficha/AbasPanel.tsx';
let content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

// The expanded content starts right after:
// <Collapse isOpen={expandido}>
//   <div className="border-t border-zinc-800 px-4 py-4 text-left text-sm leading-relaxed text-zinc-400">
//
// Then it has the Dropdowns block.
// Then the metadata block.
// We want to wrap BOTH in a flex-row.

// We will find the entire expanded div content.
// It starts with: <div className="border-t border-zinc-800 px-4 py-4 text-left text-sm leading-relaxed text-zinc-400">
// And ends before: <div className="text-sm leading-relaxed text-zinc-300 px-4 pb-4"> (this is the description block, wait no, description is in another Collapse or below it).
// Let's check AbasPanel.tsx exactly.

const match = content.match(/<Collapse isOpen=\{expandido\}>([\s\S]*?)<\/Collapse>\s*<Collapse isOpen=\{expandido\}>/);
if (match) {
  let innerBlock = match[1];
  
  // We need to extract the Dropdowns block and the Metadata block.
  // The structure is:
  // <div className="border-t border-zinc-800 px-4 py-4 text-left text-sm leading-relaxed text-zinc-400">
  //   {/* Dropdowns */}
  //   <div className="mb-4 flex flex-row items-center justify-between gap-4">
  //     <div className="flex flex-col gap-1 flex-1 min-w-0"> ... </div>
  //     {simboloImg && ... }
  //   </div>
  // </div>
  
  // Let's just do targeted replacements.
  // 1. Find the image block and remove it from the bottom.
  const imageRegex = /\{simboloImg && \([\s\S]*?<\/[iI]mg>\s*\)\}/;
  innerBlock = innerBlock.replace(imageRegex, '');
  
  // 2. Change the metadata container flex row to just a regular div since we're moving the flex higher up.
  innerBlock = innerBlock.replace(
    /<div className="mb-4 flex flex-row items-center justify-between gap-4">\s*<div className="flex flex-col gap-1 flex-1 min-w-0">/,
    `<div className="mb-4 flex flex-col gap-1">`
  );
  // Remove the extra closing div that was for the flex container
  // The end of metadata looks like: {dados && ( ... )} </div> </div> 
  // Let's be careful.
}
