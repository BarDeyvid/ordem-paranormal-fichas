import type { DadoIndividual, ResultadoRolagem } from '../types';

/**
 * Gera um identificador único para cada rolagem
 */
function gerarId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `roll_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * Sorteia um número aleatório entre 1 e o número de faces
 */
export function sortearDado(faces: number): number {
  return Math.floor(Math.random() * faces) + 1;
}

/**
 * Executa um teste de perícia ou atributo segundo as regras oficiais de Ordem Paranormal:
 * - Atributo > 0: rola [Atributo]d20 e mantém o maior (kh1).
 * - Atributo = 0: rola 2d20 e mantém o menor (kl1).
 * - Soma o bônus de treino e outros modificadores.
 */
export function rolarPericia(
  periciaNome: string,
  atributoValor: number,
  bonusTotal: number,
  atributoNome: string,
  penalidadeDados: number = 0
): ResultadoRolagem {
  const attr = Math.max(0, atributoValor);
  const qtdDados = attr === 0 ? 2 : attr;
  const keepHighest = attr > 0;

  const rolagens: number[] = [];
  for (let i = 0; i < qtdDados; i++) {
    rolagens.push(sortearDado(20));
  }

  // Encontra o índice do dado mantido
  let indiceEscolhido = 0;
  if (keepHighest) {
    let maior = -1;
    rolagens.forEach((val, idx) => {
      if (val > maior) {
        maior = val;
        indiceEscolhido = idx;
      }
    });
  } else {
    let menor = 999;
    rolagens.forEach((val, idx) => {
      if (val < menor) {
        menor = val;
        indiceEscolhido = idx;
      }
    });
  }

  const dadoEscolhido = rolagens[indiceEscolhido];
  const ehCritico = dadoEscolhido === 20;
  const ehDesastre = dadoEscolhido === 1;

  const dados: DadoIndividual[] = rolagens.map((val, idx) => ({
    faces: 20,
    valor: val,
    mantido: idx === indiceEscolhido,
    critico: val === 20,
    desastre: val === 1,
  }));

  const total = dadoEscolhido + bonusTotal;
  const dadosStr = rolagens
    .map((v, i) => (i === indiceEscolhido ? `[${v}]` : `(${v})`))
    .join(' ');
  const sinalMod = bonusTotal >= 0 ? `+ ${bonusTotal}` : `- ${Math.abs(bonusTotal)}`;
  const detalhes = `${dadosStr} ${sinalMod}`;

  const subtitulo = attr === 0 
    ? `Atributo ${atributoNome} ${penalidadeDados < 0 ? `(${penalidadeDados}d20) ` : ''}(Desvantagem: 2d20 escolhe o pior)` 
    : `Atributo ${atributoNome} ${attr} ${penalidadeDados < 0 ? `(${penalidadeDados}d20) ` : ''}(${attr}d20 escolhe o melhor)`;

  return {
    id: gerarId(),
    titulo: `Teste de ${periciaNome}`,
    subtitulo,
    tipo: 'pericia',
    dados,
    modificador: bonusTotal,
    total,
    ehCritico,
    ehDesastre,
    detalhes,
    dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

/**
 * Executa um teste de ataque de arma:
 * - Atributo em d20s (mantém o maior ou menor se 0).
 * - Margem de ameaça configurável (ex: 19 ou 18 para ameaçar crítico).
 */
export function rolarAtaque(
  armaNome: string,
  atributoValor: number,
  bonusAtaque: number,
  margemCritico: number = 20,
  periciaUsada: string = 'Pontaria',
  penalidadeDados: number = 0
): ResultadoRolagem {
  const attr = Math.max(0, atributoValor);
  const qtdDados = attr === 0 ? 2 : attr;
  const keepHighest = attr > 0;

  const rolagens: number[] = [];
  for (let i = 0; i < qtdDados; i++) {
    rolagens.push(sortearDado(20));
  }

  let indiceEscolhido = 0;
  if (keepHighest) {
    let maior = -1;
    rolagens.forEach((val, idx) => {
      if (val > maior) {
        maior = val;
        indiceEscolhido = idx;
      }
    });
  } else {
    let menor = 999;
    rolagens.forEach((val, idx) => {
      if (val < menor) {
        menor = val;
        indiceEscolhido = idx;
      }
    });
  }

  const dadoEscolhido = rolagens[indiceEscolhido];
  const ehCritico = dadoEscolhido >= margemCritico;
  const ehDesastre = dadoEscolhido === 1;

  const dados: DadoIndividual[] = rolagens.map((val, idx) => ({
    faces: 20,
    valor: val,
    mantido: idx === indiceEscolhido,
    critico: val >= margemCritico,
    desastre: val === 1,
  }));

  const total = dadoEscolhido + bonusAtaque;
  const dadosStr = rolagens
    .map((v, i) => (i === indiceEscolhido ? `[${v}]` : `(${v})`))
    .join(' ');
  const sinalMod = bonusAtaque >= 0 ? `+ ${bonusAtaque}` : `- ${Math.abs(bonusAtaque)}`;
  const detalhes = `${dadosStr} ${sinalMod}`;

  const infoPenalidade = penalidadeDados < 0 ? ` (${penalidadeDados}d20)` : '';
  const subtitulo = ehCritico
    ? `Ataque com ${periciaUsada}${infoPenalidade} (Ameaça de Crítico na margem ${margemCritico}!)`
    : `Ataque com ${periciaUsada}${infoPenalidade} (Margem de Crítico: ${margemCritico})`;

  return {
    id: gerarId(),
    titulo: `Ataque: ${armaNome}`,
    subtitulo,
    tipo: 'ataque',
    dados,
    modificador: bonusAtaque,
    total,
    ehCritico,
    ehDesastre,
    detalhes,
    dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

/**
 * Rola a expressão de dano de uma arma ou habilidade:
 * Se for crítico, multiplica os dados base pelo multiplicador de crítico.
 */
export function rolarDano(
  armaNome: string,
  expressaoDano: string,
  multCritico: number = 2,
  isCritico: boolean = false
): ResultadoRolagem {
  const dados: DadoIndividual[] = [];
  let somaDados = 0;
  let bonusFixo = 0;

  // Limpa espaços
  const expr = (expressaoDano || '1d6').trim();

  // Divide termos por + ou -
  const regex = /([+-]?\s*\d+d\d+\*?(?:\[.*?\])?)|([+-]?\s*\d+(?:\[.*?\])?)/gi;
  const matches = expr.match(regex) || [expr];

  matches.forEach((m, idx) => {
    let termo = m.replace(/\s/g, '');
    let sinal = 1;
    if (termo.startsWith('-')) {
      sinal = -1;
      termo = termo.substring(1);
    } else if (termo.startsWith('+')) {
      termo = termo.substring(1);
    }

    // Remove anotações como [Sangue] para rolagem
    termo = termo.replace(/\[.*?\]/g, '');

    const diceMatch = termo.match(/^(\d+)d(\d+)(\*?)$/i);
    if (diceMatch) {
      let count = parseInt(diceMatch[1], 10);
      const faces = parseInt(diceMatch[2], 10);
      const hasStar = diceMatch[3] === '*';

      // Se for acerto crítico: multiplica os dados base (primeiro termo de dado ou com *)
      if (isCritico && (idx === 0 || hasStar)) {
        count = count * multCritico;
      }

      for (let i = 0; i < count; i++) {
        const val = sortearDado(faces);
        somaDados += sinal * val;
        dados.push({
          faces,
          valor: val,
          mantido: true,
          critico: val === faces,
          desastre: val === 1,
        });
      }
    } else {
      const num = parseInt(termo, 10);
      if (!isNaN(num)) {
        bonusFixo += sinal * num;
      }
    }
  });

  const total = Math.max(0, somaDados + bonusFixo);
  const dadosStr = dados.map(d => `${d.valor} (d${d.faces})`).join(' + ');
  const sinalMod = bonusFixo > 0 ? ` + ${bonusFixo}` : bonusFixo < 0 ? ` - ${Math.abs(bonusFixo)}` : '';
  const detalhes = `${dadosStr}${sinalMod}`;

  const subtitulo = isCritico
    ? `Dano Crítico Multiplicado (x${multCritico})`
    : `Dano Normal (${expressaoDano})`;

  return {
    id: gerarId(),
    titulo: `Dano: ${armaNome}`,
    subtitulo,
    tipo: 'dano',
    dados,
    modificador: bonusFixo,
    total,
    ehCritico: isCritico,
    ehDesastre: false,
    detalhes,
    dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

/**
 * Rolagem livre de dados através da bandeja manual
 */
export function rolarLivre(
  qtd: number,
  faces: number,
  mod: number = 0,
  keepMode: 'highest' | 'lowest' | 'all' = 'all',
  descricao: string = 'Rolagem Livre'
): ResultadoRolagem {
  const count = Math.max(1, Math.min(100, qtd));
  const f = Math.max(2, Math.min(1000, faces));

  const rolagens: number[] = [];
  for (let i = 0; i < count; i++) {
    rolagens.push(sortearDado(f));
  }

  let indicesMantidos = new Set<number>();
  if (keepMode === 'all') {
    indicesMantidos = new Set(rolagens.map((_, i) => i));
  } else if (keepMode === 'highest') {
    let maior = -1;
    let idxMaior = 0;
    rolagens.forEach((v, i) => {
      if (v > maior) {
        maior = v;
        idxMaior = i;
      }
    });
    indicesMantidos.add(idxMaior);
  } else if (keepMode === 'lowest') {
    let menor = 99999;
    let idxMenor = 0;
    rolagens.forEach((v, i) => {
      if (v < menor) {
        menor = v;
        idxMenor = i;
      }
    });
    indicesMantidos.add(idxMenor);
  }

  let somaMantidos = 0;
  const dados: DadoIndividual[] = rolagens.map((val, idx) => {
    const mantido = indicesMantidos.has(idx);
    if (mantido) somaMantidos += val;
    return {
      faces: f,
      valor: val,
      mantido,
      critico: f === 20 && val === 20 && mantido,
      desastre: f === 20 && val === 1 && mantido,
    };
  });

  const total = somaMantidos + mod;
  const dadosStr = rolagens
    .map((v, i) => (indicesMantidos.has(i) ? `[${v}]` : `~~${v}~~`))
    .join(' ');
  const sinalMod = mod > 0 ? `+ ${mod}` : mod < 0 ? `- ${Math.abs(mod)}` : '';
  const detalhes = `${dadosStr} ${sinalMod}`.trim();

  const ehCritico = dados.some(d => d.critico && d.mantido);
  const ehDesastre = dados.some(d => d.desastre && d.mantido);

  return {
    id: gerarId(),
    titulo: descricao || `${count}d${f}${mod ? (mod > 0 ? `+${mod}` : `${mod}`) : ''}`,
    tipo: 'livre',
    dados,
    modificador: mod,
    total,
    ehCritico,
    ehDesastre,
    detalhes,
    dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}
