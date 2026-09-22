import type { 
  ArmaInventario, 
  ProtecaoInventario, 
  ItemGeralInventario, 
  MunicaoInventario,
  Maldicao,
  Atributos
} from '../types';

export interface MaldicoesBonusGlobais {
  pv: number;
  pe: number;
  defesa: number;
  deslocamento: number; // in meters
  pericias: Record<string, number>;
  resistenciasExtras: string[];
  atributos: Partial<Atributos>;
  bonusDT: number;
}

export function calcularBonusMaldicoes(
  armas: ArmaInventario[],
  protecoes: ProtecaoInventario[],
  itens: ItemGeralInventario[],
  municoes: MunicaoInventario[],
  todasMaldicoes: Maldicao[]
): MaldicoesBonusGlobais {
  let pv = 0;
  let pe = 0;
  let defesa = 0;
  let deslocamento = 0;
  let bonusDT = 0;
  const pericias: Record<string, number> = {};
  const resistenciasExtras: string[] = [];
  const atributos: Partial<Atributos> = {
    forca: 0,
    agilidade: 0,
    intelecto: 0,
    vigor: 0,
    presenca: 0
  };

  if (!todasMaldicoes || todasMaldicoes.length === 0) {
    return { pv, pe, defesa, deslocamento, pericias, resistenciasExtras, atributos, bonusDT };
  }

  const allMaldicoes: { id: number, elem?: string }[] = [];

  armas.forEach(a => {
    if (Array.isArray(a.maldicoes)) a.maldicoes.forEach(m => allMaldicoes.push({ id: m, elem: a.maldicoes_elementos?.[m] }));
  });
  protecoes.forEach(p => {
    if (p.equipado && Array.isArray(p.maldicoes)) p.maldicoes.forEach(m => allMaldicoes.push({ id: m, elem: p.maldicoes_elementos?.[m] }));
  });
  itens.forEach(i => {
    if (i.equipado && Array.isArray(i.maldicoes)) i.maldicoes.forEach(m => allMaldicoes.push({ id: m, elem: i.maldicoes_elementos?.[m] }));
  });
  municoes.forEach(m => {
    if (Array.isArray(m.maldicoes)) m.maldicoes.forEach(m => allMaldicoes.push({ id: m, elem: m.maldicoes_elementos?.[m] }));
  });

  for (let { id, elem } of allMaldicoes) {
    id = Number(id);
    const mald = todasMaldicoes.find(m => m.Codigo_Mald === id);
    if (!mald) continue;

    const nome = mald.Nome_Mald.trim().toLowerCase();

    // Proteção Elemental
    if (nome.includes('proteção elemental') && elem) {
      resistenciasExtras.push(elem + ' 10');
    }

    // Sombria
    if (nome === 'sombria') {
      pericias['Furtividade'] = (pericias['Furtividade'] || 0) + 5;
    }
    // Lépida
    else if (nome === 'lépida' || nome === 'lepida') {
      pericias['Atletismo'] = (pericias['Atletismo'] || 0) + 10;
      deslocamento += 3;
    }
    // Carisma
    else if (nome === 'carisma') {
      atributos.presenca = (atributos.presenca || 0) + 1;
    }
    // Sagacidade
    else if (nome === 'sagacidade') {
      atributos.intelecto = (atributos.intelecto || 0) + 1;
    }
    // Destreza
    else if (nome === 'destreza') {
      atributos.agilidade = (atributos.agilidade || 0) + 1;
    }
    // Disposição
    else if (nome === 'disposição' || nome === 'disposicao') {
      atributos.vigor = (atributos.vigor || 0) + 1;
    }
    // Pujança
    else if (nome === 'pujança' || nome === 'pujanca') {
      atributos.forca = (atributos.forca || 0) + 1;
    }
    // Esforço Adicional
    else if (nome === 'esforço adicional' || nome === 'esforco adicional') {
      pe += 5;
    }
    // Vitalidade
    else if (nome === 'vitalidade') {
      pv += 15;
    }
    // Potência
    else if (nome === 'potência' || nome === 'potencia') {
      bonusDT += 1;
    }
    // Cinética
    else if (nome === 'cinética' || nome === 'cinetica') {
      defesa += 2;
      resistenciasExtras.push('Dano 2 (ou 5 se pesada)');
    }
    // Letárgica
    else if (nome === 'letárgica' || nome === 'letargica') {
      defesa += 2;
    }
    // Defesa
    else if (nome === 'defesa') {
      defesa += 5;
    }
    // Profética
    else if (nome === 'profética' || nome === 'profetica') {
      resistenciasExtras.push('Conhecimento 10');
    }
    // Voltaica
    else if (nome === 'voltaica') {
      resistenciasExtras.push('Energia 10');
    }
    // Repulsiva
    else if (nome === 'repulsiva') {
      resistenciasExtras.push('Morte 10');
    }
    // Regenerativa
    else if (nome === 'regenerativa') {
      resistenciasExtras.push('Sangue 10');
    }
    // Escudo Mental
    else if (nome === 'escudo mental') {
      resistenciasExtras.push('Mental 10');
    }
  }

  return { pv, pe, defesa, deslocamento, pericias, resistenciasExtras, atributos, bonusDT };
}
