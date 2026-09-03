const fs = require('fs');

function replaceSpeed(file, searchStr, replaceStr) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(searchStr)) {
    content = content.replaceAll(searchStr, replaceStr);
    fs.writeFileSync(file, content);
    console.log("Updated speed in " + file);
  } else {
    console.log("Did not find search string in " + file);
  }
}

// 1. Update Collapse.tsx default
replaceSpeed('src/components/Collapse.tsx', "duration = '0.25s'", "duration = '0.35s'");

// 2. Update the header slide transition to match
replaceSpeed('src/screens/Ficha/AbasPanel.tsx', "transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'", "transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'");
replaceSpeed('src/components/ModalRituais.tsx', "transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'", "transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'");
replaceSpeed('src/components/ModalRituaisExtra.tsx', "transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'", "transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'");

// 3. Update the hardcoded timeout in Collapse.tsx from 300 to 400 (to give padding for the 350ms transition)
let collapseContent = fs.readFileSync('src/components/Collapse.tsx', 'utf8');
collapseContent = collapseContent.replace('setTimeout(() => setIsFullyOpen(true), 300)', 'setTimeout(() => setIsFullyOpen(true), 400)');
fs.writeFileSync('src/components/Collapse.tsx', collapseContent);
console.log("Updated timeout in Collapse.tsx");
