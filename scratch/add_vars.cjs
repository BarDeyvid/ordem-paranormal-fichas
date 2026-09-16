const fs = require('fs');
let c = fs.readFileSync('src/screens/Ficha/index.tsx', 'utf-8');

const target = `function AtributosFicha() {
  const { atributos, setAtributos, bonusAtributos, setBonusAtributos, bloquearLetras, atributosFinais } = useRPG();

  const renderAtributo = (nome: AtributoKey, posClasses: string) => {`;

const newCode = `function AtributosFicha() {
  const { atributos, setAtributos, bonusAtributos, setBonusAtributos, bloquearLetras, atributosFinais, nex, setNex, regras } = useRPG();

  const renderAtributo = (nome: AtributoKey, posClasses: string) => {`;

c = c.replace(target, newCode);
fs.writeFileSync('src/screens/Ficha/index.tsx', c, 'utf-8');
console.log('Success vars');
