const fs = require('fs');
let c = fs.readFileSync('src/screens/Ficha/InventarioPanel.tsx', 'utf8');

c = c.replace(/const armasAmaldicoadasExibidas = armasExibidas\.filter\(i => i\.arma\.isAmaldicoada\);/g, 
  `const armasAmaldicoadasExibidas = armasExibidas.filter(i => i.arma.isAmaldicoada); 
  React.useEffect(() => {
    if (armasAmaldicoadasExibidas.length > 0) {
      console.log('ALERT! Armas Amaldicoadas Exibidas: ', armasAmaldicoadasExibidas.length);
      // alert('Temos ' + armasAmaldicoadasExibidas.length + ' armas amaldicoadas no inventario!');
    }
  }, [armasAmaldicoadasExibidas.length]);`);

fs.writeFileSync('src/screens/Ficha/InventarioPanel.tsx', c);
