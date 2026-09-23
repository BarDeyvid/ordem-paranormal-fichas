const fs = require('fs');
const lines = fs.readFileSync('src/screens/Ficha/InventarioPanel.tsx', 'utf8').split('\n');

// Lines to remove: 1465 to 1497
// Array indices: 1464 to 1496
const block = lines.slice(1464, 1497); // slice is end-exclusive, so up to index 1496

// Remove lines from array
lines.splice(1464, 33); // 1496 - 1464 + 1 = 33 lines

// Insert lines after index 1625 (line 1626). Since we removed 33 lines before it, the target index shifts!
// Target line was 1626 -> index 1625.
// Shifted index: 1625 - 33 = 1592
lines.splice(1592, 0, ...block);

fs.writeFileSync('src/screens/Ficha/InventarioPanel.tsx', lines.join('\n'), 'utf8');
console.log("Success");
