import React from 'react';
import { useRPG } from '../../context/RPGContext';

export interface FichaA4PageProps {
  customRpg?: any;
}

export const FichaA4Page2: React.FC<FichaA4PageProps> = ({ customRpg }) => {
  const contextRpg = useRPG();
  const rpg = customRpg || contextRpg;

  const {
    nomeEditando,
    classe,
    nex,
    armasHook,
    rituaisHook,
    origensHook,
    trilhasHook,
    poderesHook,
    inventarioHook,
    itensHook,
    protecoesHook,
    status,
    atributosFinais,
    descricaoEditando,
    periciasHook,
  } = rpg;

  // 1. Armas
  const armas = (armasHook?.armasInventario || []).map((inv: any) => {
    const a = inv.arma;
    const mods = [
      ...(inv.modificacoes || []).map((m: any) => m.Nome_Modificacao || m.nome),
      ...(inv.maldicoes || []).map((m: any) => m.Nome_Maldicao || m.nome),
    ].filter(Boolean).join(', ');

    const periciaNome = a.Tipo_Arma?.toLowerCase()?.includes('fogo') ? 'Pontaria' : 'Luta';
    const periciaObj = periciasHook?.pericias?.[periciaNome];
    const bonusAtaque = (periciaObj?.treino || 0) + (periciaObj?.outros || 0);

    return {
      id: inv.id,
      nome: a.Nome_Item,
      testeAtaque: `+${bonusAtaque} (${periciaNome})`,
      dano: a.Dano_Arma,
      critico: `${a.Critico_Arma || 20}/x${a.Multiplicador_Arma || 2}`,
      alcance: a.Alcance_Item || 'Curto',
      tipo: a.Tipo_Dano_Arma || a.Tipo_Arma || '—',
      espaco: a['Espaços_Item'] || 1,
      modificacoes: mods || '—',
    };
  });

  // 2. Rituais
  const peTurno = status?.peTurno || 1;
  const isGraduado = Boolean(
    trilhasHook?.trilhaSelecionada?.Nome_Trilha?.toLowerCase().includes('graduado') ||
    trilhasHook?.versatilidadeSelecionada?.Nome_Trilha?.toLowerCase().includes('graduado')
  );
  const attrDT = isGraduado ? (atributosFinais?.INT ?? 0) : (atributosFinais?.PRE ?? 0);
  const dtResistencia = 10 + peTurno + attrDT;

  const rituais = (rituaisHook?.rituaisAprendidos || []).map((ra: any) => {
    const base = (rituaisHook?.rituais || []).find((r: any) => r.Codigo_Ritual === ra.Codigo_Ritual) || {};
    const nome = ra.customNome || base.Nome_Ritual || 'Ritual';
    const circulo = base.Circulo_Ritual || '1° Círculo';
    const elemento = ra.ElementoEscolhidoPermanente || base.Elemento_Ritual || 'Sangue';
    const pe = base.PE_Ritual || '1';
    const alcance = base.Alcance_Ritual || 'Curto';
    const duracao = base.Duracao_Ritual || 'Instantânea';
    const resistencia = base.Resistencia_Ritual || 'Nenhuma';
    const dados = base.Dados_Ritual || '—';

    return {
      id: `${ra.Codigo_Ritual}_${ra.Origem}`,
      nome,
      circulo,
      elemento,
      pe,
      alcance,
      duracao,
      resistencia: resistencia !== 'Nenhuma' ? `DT ${dtResistencia} (${resistencia})` : 'Nenhuma',
      dados,
      descricao: ra.customDesc || base.Descricao_Ritual || '',
    };
  });

  // 3. Habilidades e Poderes
  const habilidades: { titulo: string; tipo: string; descricao: string }[] = [];

  if (origensHook?.origemSelecionada) {
    habilidades.push({
      titulo: origensHook.origemSelecionada.Nome || 'Poder de Origem',
      tipo: 'Origem',
      descricao: origensHook.origemSelecionada.Descricao || origensHook.origemSelecionada.Poder || '',
    });
  }

  if (trilhasHook?.trilhaSelecionada) {
    habilidades.push({
      titulo: trilhasHook.trilhaSelecionada.Nome_Trilha,
      tipo: 'Trilha',
      descricao: `Trilha de ${classe || 'Agente'}.`,
    });
  }

  if (poderesHook?.poderesEscolhidos) {
    Object.values(poderesHook.poderesEscolhidos).forEach((p: any) => {
      if (p && p.Nome) {
        habilidades.push({
          titulo: p.Nome,
          tipo: p.Tipo || 'Poder',
          descricao: p.Descricao || '',
        });
      }
    });
  }

  // 4. Inventário
  const itensGerais = (itensHook?.itensInventario || []).map((inv: any) => ({
    nome: inv.item.Nome_Item,
    categoria: inv.item.Categoria_Item || '0',
    espacos: inv.item['Espaços_Item'] || 1,
    qtd: inv.qtd || 1,
    descricao: inv.item.Descricao_Item || '',
  }));

  const cargaAtual = inventarioHook?.cargaAtual || 0;
  const cargaMaxima = inventarioHook?.cargaMaxima || 5;
  const cargaSobrecarga = inventarioHook?.cargaSobrecarga || 10;

  return (
    <div className="page-a4 w-[210mm] max-w-[210mm] min-h-[285mm] mx-auto bg-white text-zinc-950 p-6 flex flex-col justify-between font-sans text-xs box-border print:m-0 print:p-4">
      <div>
        {/* ══════ CABEÇALHO DA PÁGINA 2 ══════ */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
          <div>
            <h1 className="font-display font-black text-sm tracking-[0.2em] uppercase leading-none text-black">
              ORDEM PARANORMAL RPG
            </h1>
            <p className="text-[10px] tracking-wider uppercase font-semibold text-zinc-600 mt-0.5">
              Armas, Habilidades, Grimório & Inventário
            </p>
          </div>
          <div className="flex items-center gap-3 text-right">
            <span className="font-bold text-xs text-black">{nomeEditando || 'Agente'}</span>
            <span className="border border-black px-2 py-0.5 font-bold text-[10px] uppercase bg-zinc-50">
              NEX {nex || 5}%
            </span>
          </div>
        </div>

        {/* ══════ ARMAS & ATAQUES ══════ */}
        <div className="border border-black rounded p-2.5 bg-white mb-3">
          <div className="flex items-center justify-between border-b border-black pb-1 mb-1.5">
            <h2 className="font-display font-bold uppercase text-[11px] tracking-widest text-black">
              Armas & Ataques de Combate
            </h2>
            <span className="text-[9px] text-zinc-500 font-mono">Proficiências & Modificações</span>
          </div>

          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="border-b border-zinc-400 text-zinc-600 uppercase text-[8px]">
                <th className="text-left pb-1">Arma</th>
                <th className="text-center pb-1">Ataque</th>
                <th className="text-center pb-1">Dano</th>
                <th className="text-center pb-1">Crítico</th>
                <th className="text-center pb-1">Alcance</th>
                <th className="text-center pb-1">Tipo</th>
                <th className="text-left pb-1">Modificações</th>
              </tr>
            </thead>
            <tbody>
              {armas.length > 0 ? (
                armas.map((a: any) => (
                  <tr key={a.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-1 font-bold text-black">{a.nome}</td>
                    <td className="text-center font-mono font-bold text-black">{a.testeAtaque}</td>
                    <td className="text-center font-mono font-bold">{a.dano}</td>
                    <td className="text-center font-mono">{a.critico}</td>
                    <td className="text-center">{a.alcance}</td>
                    <td className="text-center">{a.tipo}</td>
                    <td className="text-zinc-600 truncate max-w-[120px]">{a.modificacoes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-2 text-center text-zinc-400 italic">
                    Nenhuma arma equipada no inventário.
                  </td>
                </tr>
              )}
              {/* Linhas em branco extras para anotações na mesa física */}
              {armas.length < 3 &&
                Array.from({ length: 3 - armas.length }).map((_, i) => (
                  <tr key={`blank-weapon-${i}`} className="border-b border-zinc-200 h-6">
                    <td colSpan={7}></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* ══════ GRID DE HABILIDADES & RITUAIS ══════ */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          
          {/* HABILIDADES & PODERES */}
          <div className="border border-black rounded p-2.5 bg-white flex flex-col">
            <h2 className="font-display font-bold uppercase text-[11px] tracking-widest text-black border-b border-black pb-1 mb-2">
              Habilidades & Poderes
            </h2>
            <div className="flex flex-col gap-2 max-h-[75mm] overflow-hidden text-[10px]">
              {habilidades.length > 0 ? (
                habilidades.slice(0, 6).map((h, i) => (
                  <div key={i} className="border-b border-zinc-100 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-black">{h.titulo}</span>
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold">{h.tipo}</span>
                    </div>
                    <p className="text-[9px] text-zinc-600 line-clamp-2 mt-0.5 leading-snug">
                      {h.descricao}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-400 italic text-[10px]">Nenhuma habilidade registrada.</p>
              )}
            </div>
          </div>

          {/* GRIMÓRIO DE RITUAIS */}
          <div className="border border-black rounded p-2.5 bg-white flex flex-col">
            <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
              <h2 className="font-display font-bold uppercase text-[11px] tracking-widest text-black">
                Grimório de Rituais
              </h2>
              <span className="text-[9px] font-bold text-purple-950 font-mono">
                DT Resist: {dtResistencia}
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-[75mm] overflow-hidden text-[10px]">
              {rituais.length > 0 ? (
                rituais.slice(0, 5).map((r: any) => (
                  <div key={r.id} className="border-b border-zinc-100 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-black">{r.nome}</span>
                      <div className="flex items-center gap-1.5 font-mono text-[9px]">
                        <span className="font-bold text-purple-900">{r.elemento}</span>
                        <span className="text-zinc-400">•</span>
                        <span>{r.pe} PE</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[8px] text-zinc-500 mt-0.5">
                      <span>Alc: {r.alcance}</span>
                      <span>•</span>
                      <span>Dur: {r.duracao}</span>
                      <span>•</span>
                      <span>{r.resistencia}</span>
                    </div>
                    {r.dados !== '—' && (
                      <div className="text-[9px] font-mono font-bold text-zinc-800 mt-0.5">
                        Dados: {r.dados}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-zinc-400 italic text-[10px]">Nenhum ritual aprendido.</p>
              )}
            </div>
          </div>
        </div>

        {/* ══════ INVENTÁRIO & ANOTAÇÕES ══════ */}
        <div className="grid grid-cols-12 gap-3">
          
          {/* ITENS & EQUIPAMENTOS (7 colunas) */}
          <div className="col-span-7 border border-black rounded p-2.5 bg-white">
            <div className="flex items-center justify-between border-b border-black pb-1 mb-1.5">
              <h2 className="font-display font-bold uppercase text-[11px] tracking-widest text-black">
                Inventário & Equipamento
              </h2>
              <span className="text-[9px] font-bold font-mono">
                Carga: {cargaAtual}/{cargaMaxima} (Max: {cargaSobrecarga})
              </span>
            </div>

            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-400 text-zinc-600 uppercase text-[8px]">
                  <th className="text-left pb-1">Item</th>
                  <th className="text-center pb-1 w-8">Cat</th>
                  <th className="text-center pb-1 w-8">Esp</th>
                  <th className="text-center pb-1 w-8">Qtd</th>
                  <th className="text-left pb-1">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {itensGerais.length > 0 ? (
                  itensGerais.slice(0, 6).map((item: any, idx: number) => (
                    <tr key={idx} className="border-b border-zinc-100">
                      <td className="py-0.5 font-medium truncate max-w-[120px] text-black">{item.nome}</td>
                      <td className="text-center font-mono text-[9px]">{item.categoria}</td>
                      <td className="text-center font-mono text-[9px]">{item.espacos}</td>
                      <td className="text-center font-mono text-[9px] font-bold">{item.qtd}</td>
                      <td className="text-zinc-500 truncate max-w-[130px] text-[9px]">{item.descricao}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-1 text-center text-zinc-400 italic">
                      Mochila vazia.
                    </td>
                  </tr>
                )}
                {/* Linhas em branco para preencher durante a sessão */}
                {itensGerais.length < 5 &&
                  Array.from({ length: 5 - itensGerais.length }).map((_, i) => (
                    <tr key={`blank-item-${i}`} className="border-b border-zinc-200 h-5">
                      <td colSpan={5}></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* ANOTAÇÕES DA MISSÃO (5 colunas) */}
          <div className="col-span-5 border border-black rounded p-2.5 bg-white flex flex-col justify-between">
            <h2 className="font-display font-bold uppercase text-[11px] tracking-widest text-black border-b border-black pb-1 mb-1.5">
              Anotações da Missão
            </h2>
            <div className="flex-1 text-[9px] text-zinc-700 leading-relaxed font-serif whitespace-pre-wrap overflow-hidden max-h-[35mm]">
              {descricaoEditando || 'Anotações sobre pistas, contatos da Ordo Realitas, rituais observados e eventos paranormais da investigação.'}
            </div>
            <div className="border-t border-zinc-200 pt-1 text-[8px] text-zinc-400 italic">
              Espaço reservado para registro de campo e pistas
            </div>
          </div>
        </div>
      </div>

      {/* ══════ RODAPÉ DA PÁGINA 2 ══════ */}
      <div className="pt-2 border-t border-zinc-300 flex items-center justify-between text-[8px] text-zinc-500 uppercase tracking-widest mt-2">
        <span>Ordem Paranormal RPG © Jambô Editora</span>
        <span>Dossiê da Ordo Realitas</span>
        <span>Página 2 de 2</span>
      </div>
    </div>
  );
};
