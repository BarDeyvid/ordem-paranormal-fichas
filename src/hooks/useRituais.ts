import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Ritual } from '../types';

interface UseRituaisReturn {
  rituais: Ritual[];
  loading: boolean;
  error: string | null;
}

function normalizarRitual(item: Record<string, unknown>): Ritual {
  const str = (val: unknown) => (val !== null && val !== undefined ? String(val) : '');
  const bool = (val: unknown) => val === true || val === 'TRUE' || val === 'true';

  return {
    Codigo_Ritual: Number(item['Codigo_Ritual'] ?? 0),
    Nome_Ritual: str(item['Nome_Ritual']),
    Descricao_Ritual: str(item['Descricao_Ritual']),
    Elemento_Ritual: str(item['Elemento_Ritual']),
    Circulo_Ritual: Number(item['Circulo_Ritual'] ?? 1),
    PE_Ritual: str(item['PE_Ritual']),
    Execucao_Ritual: str(item['Execucao_Ritual']),
    Alcance_Ritual: str(item['Alcance_Ritual']),
    Area_Ritual: str(item['Area_Ritual']),
    Alvo_Ritual: str(item['Alvo_Ritual']),
    Duracao_Ritual: str(item['Duracao_Ritual']),
    Efeito_Ritual: str(item['Efeito_Ritual']),
    Resistencia_Ritual: str(item['Resistencia_Ritual']),
    Dados_Ritual: str(item['Dados_Ritual']),
    Tem_Discente: bool(item['Tem Discente?'] ?? item['Tem_Discente']),
    Tem_Verdadeiro: bool(item['Tem Verdadeiro?'] ?? item['Tem_Verdadeiro']),
    Imagem: str(item['Imagem']),
    Requisito_Discente: str(item['Requisito_Discente']),
    Requisito_Verdadeiro: str(item['Requisito_Verdadeiro']),
  };
}

export function useRituais(): UseRituaisReturn & {
  rituaisAprendidos: import('../types').RitualAprendido[];
  aprenderRitual: (ritual: import('../types').RitualAprendido) => void;
  esquecerRitual: (origem: string) => void;
  editarRitual: (origem: string, customNome?: string, customDesc?: string, customProps?: import('../types').RitualAprendido['customProps']) => void;
  atualizarRituaisAprendidos: (novos: import('../types').RitualAprendido[]) => void;
  simbolosRituais: Map<number, string>;
} {
  const [rituais, setRituais] = useState<Ritual[]>([]);
  const [simbolosRaw, setSimbolosRaw] = useState<{ codigo: number; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🔥 NOVO ESTADO: Rituais Aprendidos
  const [rituaisAprendidos, setRituaisAprendidos] = useState<import('../types').RitualAprendido[]>([]);

  const simbolosRituais = new Map(simbolosRaw.map(s => [s.codigo, s.url]));

  useEffect(() => {
    let cancelled = false;

    async function fetchRituais() {
      try {
        setLoading(true);
        const [rituaisRes, simbolosRes] = await Promise.all([
          supabase.from('Rituais').select('*').order('Circulo_Ritual', { ascending: true }),
          supabase.from('Símbolos Rituais').select('Codigo_Ritual, Link_Imagem')
        ]);

        if (rituaisRes.error) throw rituaisRes.error;
        if (simbolosRes.error) throw simbolosRes.error;

        if (!cancelled) {
          const rituaisNormalized = rituaisRes.data.map(normalizarRitual);
          setRituais(rituaisNormalized);

          const simbolosTransformados = (simbolosRes.data || [])
            .filter(row => row.Link_Imagem)
            .map(row => {
              const rawUrl = row.Link_Imagem.replace(/[?&]dl=[01]/, (m: string) => m[0] + 'raw=1');
              return { codigo: Number(row.Codigo_Ritual), url: rawUrl };
            });
          setSimbolosRaw(simbolosTransformados);
          
          // Pre-load the images in the background so they appear instantly
          simbolosTransformados.forEach(s => {
            const img = new Image();
            img.src = s.url;
          });
        }
      } catch (err: any) {
        console.error('Erro ao buscar rituais:', err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRituais();
    return () => { cancelled = true; };
  }, []);

  const aprenderRitual = (ritual: import('../types').RitualAprendido) => {
    setRituaisAprendidos(prev => [...prev, ritual]);
  };

  const esquecerRitual = (origem: string) => {
    setRituaisAprendidos(prev => prev.filter(r => r.origem !== origem));
  };

  const editarRitual = (origem: string, customNome?: string, customDesc?: string, customProps?: import('../types').RitualAprendido['customProps']) => {
    setRituaisAprendidos(prev => prev.map(r => {
      if (r.origem === origem) {
        return { ...r, customNome, customDesc, customProps };
      }
      return r;
    }));
  };

  return { rituais, loading, error, rituaisAprendidos, aprenderRitual, esquecerRitual, editarRitual };
}
