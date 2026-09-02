const { readFileSync } = require('fs');

// simulate
function normalizarPoderParanormal(item) {
  const primeiro = (...chaves) => {
    for (const chave of chaves) {
      const valor = item[chave];
      if (valor !== undefined && valor !== null) return valor;
    }
    return undefined;
  };

  return {
    'Automatico?': (primeiro('Automatico?', 'automatico?') ) || null,
    'Automatico?_Afinidade': (primeiro('Automatico?_Afinidade', 'automatico?_afinidade') ) || null,
  };
}

console.log(normalizarPoderParanormal({
  "Automatico?": "Sim",
  "Automatico?_Afinidade": "Semi"
}));
