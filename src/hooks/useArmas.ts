import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';
import type { Arma, ArmaInventario } from '../types';

export function useArmas(nex: number = 0, regrasAutomaticasAtivas: Set<number> = new Set()) {
  const [armas, setArmas] = useState<Arma[]>([]);
  const [armasInventario, setArmasInventario] = useState<ArmaInventario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function carregar() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('Armas').select('*');
      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else if (data) {
        setArmas(data as Arma[]);
      }
      setLoading(false);
    }
    carregar();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setArmasInventario(prev => {
      let changed = false;
      let next = [...prev];

      // 1. Ataque Desarmado
      let danoDesarmado = '1d3';
      let tipoDanoDesarmado = 'Impacto (Não letal)';
      let agilDesarmado = false;

      if (regrasAutomaticasAtivas.has(84)) { // Artista Marcial
        danoDesarmado = nex >= 70 ? '1d10' : nex >= 35 ? '1d8' : '1d6';
        tipoDanoDesarmado = 'Impacto';
        agilDesarmado = true;
      }

      const desarmadoIndex = next.findIndex(a => a.id === 'ataque-desarmado-virtual');
      const hasDesarmado = desarmadoIndex !== -1;

      if (!hasDesarmado) {
        next.push({
          id: 'ataque-desarmado-virtual',
          arma: {
            Codigo_Arma: -2,
            Nome_Item: 'Ataque Desarmado',
            Descricao_Item: 'Um soco, chute ou outro golpe com o próprio corpo.',
            Proficiencia: 'Armas Simples',
            Tipo_Arma: 'Corpo a Corpo',
            Empunhadura_Arma: 'Uma Mão',
            Dano_Arma: danoDesarmado,
            Critico_Arma: 20,
            Multiplicador_Arma: 2,
            Tipo_Dano_Arma: tipoDanoDesarmado,
            Alcance_Item: null,
            Categoria_Item: '0',
            'Espaços_Item': 0,
            'Agil?': agilDesarmado,
            Capacidade_Municao: null,
            dt_item: null,
            'Automatica?': false,
            Fonte_Arma: 'Sistema'
          },
          modificacoes: [],
          municoesAcopladas: []
        });
        changed = true;
      } else {
        const desarmado = next[desarmadoIndex];
        if (
          desarmado.arma.Dano_Arma !== danoDesarmado ||
          desarmado.arma.Tipo_Dano_Arma !== tipoDanoDesarmado ||
          desarmado.arma['Agil?'] !== agilDesarmado
        ) {
          next[desarmadoIndex] = {
            ...desarmado,
            arma: {
              ...desarmado.arma,
              Dano_Arma: danoDesarmado,
              Tipo_Dano_Arma: tipoDanoDesarmado,
              'Agil?': agilDesarmado
            }
          };
          changed = true;
        }
      }

      // 2. Coronhada
      const armasDeFogo = next.filter(a => a.id !== 'coronhada-virtual' && a.id !== 'ataque-desarmado-virtual' && a.arma.Tipo_Arma?.toLowerCase().includes('fogo'));
      const coronhadaIndex = next.findIndex(a => a.id === 'coronhada-virtual');
      const hasCoronhada = coronhadaIndex !== -1;

      if (armasDeFogo.length > 0) {
        const temDuasMaos = armasDeFogo.some(a => a.arma.Empunhadura_Arma?.toLowerCase().includes('duas'));
        const temUmaMao = armasDeFogo.some(a => !a.arma.Empunhadura_Arma?.toLowerCase().includes('duas'));
        
        let danoCoronhada = '1d4';
        let empunhadura = 'Uma Mão';
        
        if (temDuasMaos && temUmaMao) {
          danoCoronhada = '1d4/1d6';
          empunhadura = 'Uma/Duas Mãos';
        } else if (temDuasMaos) {
          danoCoronhada = '1d6';
          empunhadura = 'Duas Mãos';
        }

        if (!hasCoronhada) {
          next.push({
            id: 'coronhada-virtual',
            arma: {
              Codigo_Arma: -1,
              Nome_Item: 'Coronhada',
              Descricao_Item: 'Você pode usar uma arma de fogo como uma arma corpo a corpo.',
              Proficiencia: 'Armas Simples',
              Tipo_Arma: 'Corpo a Corpo',
              Empunhadura_Arma: empunhadura,
              Dano_Arma: danoCoronhada,
              Critico_Arma: 20,
              Multiplicador_Arma: 2,
              Tipo_Dano_Arma: 'Impacto',
              Alcance_Item: null,
              Categoria_Item: '0',
              'Espaços_Item': 0,
              'Agil?': false,
              Capacidade_Municao: null,
              dt_item: null,
              'Automatica?': false,
              Fonte_Arma: 'Sistema'
            },
            modificacoes: [],
            municoesAcopladas: []
          });
          changed = true;
        } else {
          const coronhada = next[coronhadaIndex];
          if (coronhada.arma.Dano_Arma !== danoCoronhada) {
            next[coronhadaIndex] = {
              ...coronhada,
              arma: { ...coronhada.arma, Dano_Arma: danoCoronhada, Empunhadura_Arma: empunhadura }
            };
            changed = true;
          }
        }
      } else if (hasCoronhada) {
        next = next.filter(a => a.id !== 'coronhada-virtual');
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [armasInventario.map(a => `${a.id}-${a.arma.Dano_Arma}-${a.arma.Tipo_Arma}-${a.arma.Empunhadura_Arma}`).join(','), nex, regrasAutomaticasAtivas.has(84)]);

  const adicionarArma = (arma: Arma) => {
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    setArmasInventario(prev => [...prev, { id: newId, arma }]);
  };

  const removerArma = (id: string) => {
    setArmasInventario(prev => prev.filter(item => item.id !== id));
  };

  const reordenarArmas = (oldIndex: number, newIndex: number) => {
    setArmasInventario(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });
  };

  const acoplarMunicao = (idArma: string, idMunicao: string) => {
    setArmasInventario(prev => prev.map(item => {
      if (item.id === idArma) {
        return {
          ...item,
          municoesAcopladas: [...(item.municoesAcopladas || []), idMunicao]
        };
      }
      return item;
    }));
  };

  const desacoplarMunicao = (idArma: string, idMunicao: string) => {
    setArmasInventario(prev => prev.map(item => {
      if (item.id === idArma && item.municoesAcopladas) {
        return {
          ...item,
          municoesAcopladas: item.municoesAcopladas.filter(m => m !== idMunicao)
        };
      }
      return item;
    }));
  };

  const editarArma = (id: string, novosDados: Partial<Arma>, novasModificacoes?: number[], novasMaldicoes?: number[], novasMaldicoesElementos?: Record<number, string>) => {
    setArmasInventario(prev => prev.map(item => {
      if (item.id === id) {
        const ret: ArmaInventario = {
          ...item,
          arma: { ...item.arma, ...novosDados }
        };
        if (novasModificacoes !== undefined) {
          ret.modificacoes = novasModificacoes;
        }
        if (novasMaldicoes !== undefined) {
          ret.maldicoes = novasMaldicoes;
        }
        if (novasMaldicoesElementos !== undefined) {
          ret.maldicoes_elementos = novasMaldicoesElementos;
        }
        return ret;
      }
      return item;
    }));
  };

  const cargaArmas = useMemo(() => {
    return armasInventario.reduce((acc, item) => {
      let esp = item.arma['Espaços_Item'];
      if (typeof esp === 'string') {
        esp = esp.replace(',', '.').replace(/[^0-9.-]+/g, '');
      }
      const val = Number(esp);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [armasInventario]);

  const contagemPorCategoria = useMemo(() => {
    let counts = [0, 0, 0, 0];
    armasInventario.forEach(item => {
      const cat = String(item.arma.Categoria_Item).trim();
      if (cat === 'I') counts[0]++;
      else if (cat === 'II') counts[1]++;
      else if (cat === 'III') counts[2]++;
      else if (cat === 'IV') counts[3]++;
    });
    return counts;
  }, [armasInventario]);

  return { armas, armasInventario,    adicionarArma,
    removerArma,
    reordenarArmas,
    acoplarMunicao,
    desacoplarMunicao,
    editarArma,
    cargaArmas,
    contagemPorCategoria,
    loading, error };
}
