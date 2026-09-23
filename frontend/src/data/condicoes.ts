import type { CondicaoDef, CondicaoId, AtributoKey } from '../types';

export const CONDICOES_CATALOGO: CondicaoDef[] = [
  // ============================================================
  // FÍSICAS
  // ============================================================
  {
    id: 'caido',
    nome: 'Caído',
    categoria: 'fisica',
    icone: '🧎',
    descricao:
      'O personagem está no chão. Ele sofre –1d20 em testes de ataque corpo a corpo e seu deslocamento é reduzido a 1,5m. Além disso, sofre –5 na Defesa contra ataques corpo a corpo, mas ganha +5 na Defesa contra ataques à distância.',
    resumoEfeito: '–1d20 ataques corpo a corpo, Deslocamento 1,5m, –5 Defesa corpo a corpo (+5 contra distância)',
    penalidades: {
      deslocamentoFixo: 1.5,
      ataqueD20: -1,
    },
  },
  {
    id: 'debilitado',
    nome: 'Debilitado',
    categoria: 'fisica',
    icone: '🥀',
    descricao:
      'O personagem está severamente enfraquecido fisicamente. Sofre –2d20 em testes de Força, Agilidade e Vigor. Se o personagem ficar debilitado novamente, em vez disso fica Inconsciente.',
    resumoEfeito: '–2d20 em testes de Força, Agilidade e Vigor',
    penalidades: {
      dadosAtributo: { FOR: -2, AGI: -2, VIG: -2 },
    },
  },
  {
    id: 'desprevenido',
    nome: 'Desprevenido',
    categoria: 'fisica',
    icone: '⚡',
    descricao:
      'O personagem é apanhado de surpresa ou é incapaz de se defender com eficácia. Sofre –5 na Defesa e –5 em testes de Reflexos.',
    resumoEfeito: '–5 na Defesa e –5 em Reflexos',
    penalidades: {
      defesa: -5,
      reflexos: -5,
    },
  },
  {
    id: 'enredado',
    nome: 'Enredado',
    categoria: 'fisica',
    icone: '🕸️',
    descricao:
      'O personagem está preso por cordas, teias, gosma ou efeito similar. Sofre –1d20 em testes de ataque e de Agilidade, e seu deslocamento é reduzido à metade. Não pode correr nem fazer investidas.',
    resumoEfeito: '–1d20 em testes de ataque e Agilidade, Deslocamento ÷ 2',
    penalidades: {
      deslocamentoMult: 0.5,
      dadosAtributo: { AGI: -1 },
      ataqueD20: -1,
    },
  },
  {
    id: 'exausto',
    nome: 'Exausto',
    categoria: 'fisica',
    icone: '😫',
    descricao:
      'O personagem está no limiar do colapso físico. Fica Debilitado (–2d20 em FOR, AGI e VIG), Lento (deslocamento pela metade) e Vulnerável (–5 na Defesa).',
    resumoEfeito: 'Debilitado (–2d20 físicos), Lento (Desloc. ÷ 2) e Vulnerável (–5 Defesa)',
    penalidades: {
      defesa: -5,
      deslocamentoMult: 0.5,
      dadosAtributo: { FOR: -2, AGI: -2, VIG: -2 },
    },
  },
  {
    id: 'fatigado',
    nome: 'Fatigado',
    categoria: 'fisica',
    icone: '😮‍💨',
    descricao:
      'O personagem está cansado. Fica Fraco (–1d20 em testes de FOR, AGI e VIG) e Vulnerável (–5 na Defesa). Se ficar fatigado novamente, em vez disso fica Exausto.',
    resumoEfeito: 'Fraco (–1d20 físicos) e Vulnerável (–5 Defesa)',
    penalidades: {
      defesa: -5,
      dadosAtributo: { FOR: -1, AGI: -1, VIG: -1 },
    },
  },
  {
    id: 'fraco',
    nome: 'Fraco',
    categoria: 'fisica',
    icone: '🍂',
    descricao:
      'O personagem está com o corpo esgotado. Sofre –1d20 em testes de Força, Agilidade e Vigor. Se ficar fraco novamente, em vez disso fica Debilitado.',
    resumoEfeito: '–1d20 em testes de Força, Agilidade e Vigor',
    penalidades: {
      dadosAtributo: { FOR: -1, AGI: -1, VIG: -1 },
    },
  },
  {
    id: 'imovel',
    nome: 'Imóvel',
    categoria: 'fisica',
    icone: '⛓️',
    descricao:
      'O personagem não consegue se mover. Seu deslocamento é reduzido a 0. Além disso, fica Indefeso (–10 na Defesa e falha automática em Reflexos).',
    resumoEfeito: 'Deslocamento 0 e Indefeso (–10 Defesa)',
    penalidades: {
      defesa: -10,
      deslocamentoMult: 0,
      reflexos: -99,
    },
  },
  {
    id: 'inconsciente',
    nome: 'Inconsciente',
    categoria: 'fisica',
    icone: '💤',
    descricao:
      'O personagem está desacordado. Fica Indefeso (–10 na Defesa) e não pode realizar nenhuma ação ou reação.',
    resumoEfeito: 'Indefeso (–10 Defesa), Deslocamento 0, sem ações ou reações',
    penalidades: {
      defesa: -10,
      deslocamentoMult: 0,
      imuneReacoes: true,
      reflexos: -99,
    },
  },
  {
    id: 'indefeso',
    nome: 'Indefeso',
    categoria: 'fisica',
    icone: '🎯',
    descricao:
      'O personagem é incapaz de se defender ativamente. Fica Desprevenido e sofre –10 na Defesa, além de falhar automaticamente em testes de Reflexos. Ataques corpo a corpo adjacentes contra ele são acertos críticos automáticos.',
    resumoEfeito: '–10 na Defesa, Desprevenido, falha automática em Reflexos',
    penalidades: {
      defesa: -10,
      reflexos: -99,
    },
  },
  {
    id: 'lento',
    nome: 'Lento',
    categoria: 'fisica',
    icone: '🐌',
    descricao:
      'O personagem se move com grande dificuldade. Seu deslocamento é reduzido à metade e ele não pode correr nem realizar investidas.',
    resumoEfeito: 'Deslocamento reduzido à metade, sem corridas ou investidas',
    penalidades: {
      deslocamentoMult: 0.5,
    },
  },
  {
    id: 'paralisado',
    nome: 'Paralisado',
    categoria: 'fisica',
    icone: '🗿',
    descricao:
      'O personagem está congelado ou com músculos travados. Fica Indefeso (–10 Defesa), com deslocamento 0 e só pode realizar ações puramente mentais.',
    resumoEfeito: 'Indefeso (–10 Defesa), Deslocamento 0, apenas ações mentais',
    penalidades: {
      defesa: -10,
      deslocamentoMult: 0,
      reflexos: -99,
    },
  },
  {
    id: 'pasmo',
    nome: 'Pasmo',
    categoria: 'fisica',
    icone: '💫',
    descricao:
      'O personagem foi pego em choque ou atordoado. Não pode realizar ações nem reações até o fim do seu próximo turno.',
    resumoEfeito: 'Não realiza ações nem reações por 1 rodada',
    penalidades: {
      imuneReacoes: true,
    },
  },
  {
    id: 'sangrando',
    nome: 'Sangrando',
    categoria: 'fisica',
    icone: '🩸',
    descricao:
      'O personagem está perdendo sangue por ferimentos abertos. No início de cada um dos seus turnos, sofre 1d6 pontos de dano de Sangue até ser estabilizado com um teste de Medicina (DT 15) ou receber cura.',
    resumoEfeito: 'Sofre 1d6 de dano de Sangue no início de cada turno',
    penalidades: {
      danoPorTurno: '1d6 [Sangue]',
    },
  },
  {
    id: 'sufocado',
    nome: 'Sufocado',
    categoria: 'fisica',
    icone: '🫁',
    descricao:
      'O personagem não consegue respirar (por água, fumaça ou esganadura). A cada rodada realiza um teste de Fortitude (DT 15 + 1 por teste anterior). Se falhar, cai inconsciente e morrendo.',
    resumoEfeito: 'Testes cumulativos de Fortitude por rodada para não cair morrendo',
    penalidades: {},
  },
  {
    id: 'vulneravel',
    nome: 'Vulnerável',
    categoria: 'fisica',
    icone: '🛡️',
    descricao:
      'O personagem teve sua guarda quebrada ou perdeu o equilíbrio. Sofre –5 na Defesa.',
    resumoEfeito: '–5 na Defesa',
    penalidades: {
      defesa: -5,
    },
  },

  // ============================================================
  // MENTAIS
  // ============================================================
  {
    id: 'abalado',
    nome: 'Abalado',
    categoria: 'mental',
    icone: '😨',
    descricao:
      'O personagem está com medo ou ansiedade intensa. Sofre –1d20 em todos os testes de perícia. Se ficar abalado novamente, em vez disso fica Apavorado.',
    resumoEfeito: '–1d20 em todos os testes de perícia',
    penalidades: {
      dadosTodos: -1,
    },
  },
  {
    id: 'apavorado',
    nome: 'Apavorado',
    categoria: 'mental',
    icone: '😱',
    descricao:
      'O personagem está em pânico incontrolável. Sofre –2d20 em todos os testes de perícia e deve imediatamente fugir da fonte do medo. Não pode se aproximar voluntariamente.',
    resumoEfeito: '–2d20 em todos os testes de perícia e foge da fonte do medo',
    penalidades: {
      dadosTodos: -2,
    },
  },
  {
    id: 'confuso',
    nome: 'Confuso',
    categoria: 'mental',
    icone: '🌀',
    descricao:
      'O personagem tem dificuldade de concatenar pensamentos. Não pode realizar reações e, no início do seu turno, deve rolar 1d6: 1-3 age normalmente; 4 não age e fica balbuciando; 5-6 ataca o ser mais próximo.',
    resumoEfeito: 'Sem reações; rola 1d6 no turno (1-3 normal, 4 nada, 5-6 ataca mais próximo)',
    penalidades: {
      imuneReacoes: true,
    },
  },
  {
    id: 'enfeiticado',
    nome: 'Enfeitiçado',
    categoria: 'mental',
    icone: '💖',
    descricao:
      'O personagem enxerga o conjurador ou alvo como um amigo de confiança. Recusa-se a atacá-lo e tenta defender seus interesses, embora não obedeça comandos suicidas.',
    resumoEfeito: 'Considera o alvo um aliado fiel e recusa-se a atacá-lo',
    penalidades: {},
  },
  {
    id: 'esmorecido',
    nome: 'Esmorecido',
    categoria: 'mental',
    icone: '🧠',
    descricao:
      'O personagem está psicologicamente exaurido. Sofre –2d20 em testes de Intelecto e Presença. Se ficar esmorecido novamente, em vez disso fica Inconsciente.',
    resumoEfeito: '–2d20 em testes de Intelecto e Presença',
    penalidades: {
      dadosAtributo: { INT: -2, PRE: -2 },
    },
  },
  {
    id: 'fascinado',
    nome: 'Fascinado',
    categoria: 'mental',
    icone: '✨',
    descricao:
      'A atenção do personagem foi totalmente capturada por algo hipnotizante. Fica Desprevenido (–5 na Defesa) e não pode realizar nenhuma ação além de observar o efeito fascinante.',
    resumoEfeito: 'Desprevenido (–5 Defesa) e incapaz de agir além de observar',
    penalidades: {
      defesa: -5,
    },
  },
  {
    id: 'frustrado',
    nome: 'Frustrado',
    categoria: 'mental',
    icone: '💭',
    descricao:
      'O personagem está aborrecido ou hesitante. Sofre –1d20 em testes de Intelecto e Presença. Se ficar frustrado novamente, em vez disso fica Esmorecido.',
    resumoEfeito: '–1d20 em testes de Intelecto e Presença',
    penalidades: {
      dadosAtributo: { INT: -1, PRE: -1 },
    },
  },
  {
    id: 'perturbado',
    nome: 'Perturbado',
    categoria: 'mental',
    icone: '👁️',
    descricao:
      'O personagem sofreu um impacto severo em sua sanidade pelo Outro Lado. Sofre –1d20 em testes mentais (Intelecto e Presença) e não pode gastar PE para habilidades voluntárias.',
    resumoEfeito: '–1d20 em testes mentais e bloqueio de PE voluntário',
    penalidades: {
      dadosAtributo: { INT: -1, PRE: -1 },
    },
  },

  // ============================================================
  // SENTIDOS
  // ============================================================
  {
    id: 'cego',
    nome: 'Cego',
    categoria: 'sentidos',
    icone: '🕶️',
    descricao:
      'O personagem perdeu a visão. Fica Desprevenido (–5 na Defesa), sofre –2d20 em testes de Força e Agilidade e testes que dependem de visão (como Percepção e Pontaria), e seu deslocamento é reduzido à metade.',
    resumoEfeito: 'Desprevenido (–5 Defesa), –2d20 em FOR/AGI e visão, Deslocamento ÷ 2',
    penalidades: {
      defesa: -5,
      deslocamentoMult: 0.5,
      dadosAtributo: { FOR: -2, AGI: -2 },
    },
  },
  {
    id: 'surdo',
    nome: 'Surdo',
    categoria: 'sentidos',
    icone: '🔇',
    descricao:
      'O personagem é incapaz de ouvir. Sofre –2d20 em testes de Iniciativa e testes de Percepção baseados em audição. É imune a efeitos dependentes de som.',
    resumoEfeito: '–2d20 em Iniciativa e Percepção auditiva, imune a sons',
    penalidades: {
      reflexos: -2,
    },
  },

  // ============================================================
  // CRÍTICAS / SOBREVIVÊNCIA
  // ============================================================
  {
    id: 'morrendo',
    nome: 'Morrendo',
    categoria: 'critica',
    icone: '☠️',
    descricao:
      'O personagem atingiu 0 PV e está à beira da morte. Fica Inconsciente e Indefeso (–10 Defesa). No início de cada rodada, deve realizar um teste de Fortitude (DT 20): sucesso estabiliza; falha acumula 1 falha de morte (3 falhas ou falhar por 5+ resulta em morte).',
    resumoEfeito: 'Inconsciente, Indefeso. Teste de Fortitude DT 20 por turno para estabilizar',
    penalidades: {
      defesa: -10,
      deslocamentoMult: 0,
      imuneReacoes: true,
      reflexos: -99,
    },
  },
  {
    id: 'enlouquecendo',
    nome: 'Enlouquecendo',
    categoria: 'critica',
    icone: '🕳️',
    descricao:
      'O personagem atingiu 0 Sanidade e sua mente está sendo absorvida pelo Outro Lado. Fica Perturbado ou em colapso. No início de cada turno, deve fazer um teste de Vontade (DT 20) para conter o delírio permanente.',
    resumoEfeito: 'Mente em colapso. Teste de Vontade DT 20 por turno para conter o delírio',
    penalidades: {
      dadosAtributo: { INT: -2, PRE: -2 },
    },
  },
];

export const CONDICOES_MAP: Record<CondicaoId, CondicaoDef> = CONDICOES_CATALOGO.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CondicaoId, CondicaoDef>
);

export interface ResumoPenalidadesCalculadas {
  penalidadeDefesa: number;
  deslocamentoMultiplicador: number;
  deslocamentoFixo: number | null;
  penalidadeDadosAtributos: Record<AtributoKey, number>;
  penalidadeDadosTodos: number;
  penalidadeAtaque: number;
  sangrando: boolean;
  morrendo: boolean;
  enlouquecendo: boolean;
  inconsciente: boolean;
  caido: boolean;
}

/**
 * Calcula todas as penalidades consolidadas das condições ativas,
 * aplicando regras de acúmulo e deduplicação oficiais de Ordem Paranormal.
 */
export function calcularPenalidadesCondicoes(
  condicoesAtivas: CondicaoId[]
): ResumoPenalidadesCalculadas {
  const ativas = new Set(condicoesAtivas);

  let penalidadeDefesa = 0;
  let deslocamentoMultiplicador = 1;
  let deslocamentoFixo: number | null = null;
  const penalidadeDadosAtributos: Record<AtributoKey, number> = {
    FOR: 0,
    AGI: 0,
    INT: 0,
    PRE: 0,
    VIG: 0,
  };
  let penalidadeDadosTodos = 0;
  let penalidadeAtaque = 0;

  // 1. Defesa: Indefeso (-10) e Desprevenido (-5)
  // Indefeso já inclui Desprevenido.
  const ehIndefeso =
    ativas.has('indefeso') ||
    ativas.has('inconsciente') ||
    ativas.has('imovel') ||
    ativas.has('paralisado') ||
    ativas.has('morrendo');

  const ehDesprevenido =
    ativas.has('desprevenido') ||
    ativas.has('cego') ||
    ativas.has('fascinado');

  if (ehIndefeso) {
    penalidadeDefesa -= 10;
  } else if (ehDesprevenido) {
    penalidadeDefesa -= 5;
  }

  // Vulnerável dá -5 (acumula com Desprevenido/Indefeso conforme regras oficiais)
  const ehVulneravel =
    ativas.has('vulneravel') ||
    ativas.has('fatigado') ||
    ativas.has('exausto');

  if (ehVulneravel) {
    penalidadeDefesa -= 5;
  }

  // 2. Deslocamento
  if (
    ativas.has('imovel') ||
    ativas.has('paralisado') ||
    ativas.has('inconsciente') ||
    ativas.has('morrendo')
  ) {
    deslocamentoMultiplicador = 0;
  } else {
    if (ativas.has('caido')) {
      deslocamentoFixo = 1.5;
    }
    if (
      ativas.has('lento') ||
      ativas.has('enredado') ||
      ativas.has('exausto') ||
      ativas.has('cego')
    ) {
      deslocamentoMultiplicador = Math.min(deslocamentoMultiplicador, 0.5);
    }
  }

  // 3. Penalidades de Dados em Todos os Testes
  if (ativas.has('apavorado')) {
    penalidadeDadosTodos -= 2;
  } else if (ativas.has('abalado')) {
    penalidadeDadosTodos -= 1;
  }

  // 4. Penalidades Físicas (FOR, AGI, VIG)
  if (ativas.has('debilitado') || ativas.has('exausto')) {
    penalidadeDadosAtributos.FOR -= 2;
    penalidadeDadosAtributos.AGI -= 2;
    penalidadeDadosAtributos.VIG -= 2;
  } else if (ativas.has('fraco') || ativas.has('fatigado')) {
    penalidadeDadosAtributos.FOR -= 1;
    penalidadeDadosAtributos.AGI -= 1;
    penalidadeDadosAtributos.VIG -= 1;
  }

  // Cego penaliza FOR e AGI em -2d20 adicionais
  if (ativas.has('cego')) {
    penalidadeDadosAtributos.FOR -= 2;
    penalidadeDadosAtributos.AGI -= 2;
  }

  // Enredado penaliza AGI e Ataques em -1d20
  if (ativas.has('enredado')) {
    penalidadeDadosAtributos.AGI -= 1;
    penalidadeAtaque -= 1;
  }

  // Caído penaliza ataques corpo a corpo em -1d20
  if (ativas.has('caido')) {
    penalidadeAtaque -= 1;
  }

  // 5. Penalidades Mentais (INT, PRE)
  if (ativas.has('esmorecido') || ativas.has('enlouquecendo')) {
    penalidadeDadosAtributos.INT -= 2;
    penalidadeDadosAtributos.PRE -= 2;
  } else if (ativas.has('frustrado') || ativas.has('perturbado')) {
    penalidadeDadosAtributos.INT -= 1;
    penalidadeDadosAtributos.PRE -= 1;
  }

  return {
    penalidadeDefesa,
    deslocamentoMultiplicador,
    deslocamentoFixo,
    penalidadeDadosAtributos,
    penalidadeDadosTodos,
    penalidadeAtaque,
    sangrando: ativas.has('sangrando'),
    morrendo: ativas.has('morrendo'),
    enlouquecendo: ativas.has('enlouquecendo'),
    inconsciente: ativas.has('inconsciente') || ativas.has('morrendo'),
    caido: ativas.has('caido'),
  };
}
