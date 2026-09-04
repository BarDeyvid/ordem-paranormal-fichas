const fs = require('fs');
const content = fs.readFileSync('src/screens/Ficha/AbasPanel.tsx', 'utf8');
const search = 'className="mb-2 overflow-hidden rounded-r border-l-4 border-green-800';

let currentIndex = 0;
while ((currentIndex = content.indexOf(search, currentIndex)) !== -1) {
    console.log(content.substring(currentIndex - 50, currentIndex + 100));
    console.log('---');
    currentIndex += search.length;
}
