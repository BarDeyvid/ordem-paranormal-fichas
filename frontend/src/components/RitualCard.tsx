import React from 'react';
import { Collapse } from './Collapse';
import { CustomSelect } from './CustomSelect';
import { formatarDescricao } from '../utils/formatters';
import { verificarRequisitoRitual, verificarAcessoCirculo } from '../utils/rpgRules';
import { RPGContext } from '../context/RPGContext';
import type { VersaoRitual, ResultadoConjuracao, ConjurarRitualParams } from '../types';

export const CORES_ELEMENTOS: Record<string, string> = {
  sangue: '#b31717',
  conhecimento: '#b07902',
  energia: '#af27d9',
  morte: '#000000',
  medo: '#ffffff',
  varia: '#888888',
  lista: '#888888',
};

export function obterCorBadge(elemento: string): string {
  if (!elemento) return '#666';
  const elementoStr = elemento.toLowerCase();
  if (elementoStr.includes(' e ')) {
    const partes = elementoStr.split(' e ');
    const cor1 = CORES_ELEMENTOS[partes[0].trim()] || '#666';
    const cor2 = CORES_ELEMENTOS[partes[1].trim()] || '#666';
    return `linear-gradient(135deg, ${cor1} 50%, ${cor2} 50%)`;
  }
  return CORES_ELEMENTOS[elementoStr] || '#666';
}

export function obterCorElementoPrimario(elemento: string): string {
  if (!elemento) return '#666';
  const elementoStr = elemento.toLowerCase();
  if (elementoStr.includes(' e ')) {
    const partes = elementoStr.split(' e ');
    return CORES_ELEMENTOS[partes[0].trim()] || '#666';
  }
  return CORES_ELEMENTOS[elementoStr] || '#666';
}

export function obterValorVersao(
  campo: string,
  versao: VersaoRitual,
  temDiscente: boolean,
  temVerdadeiro: boolean
): string {
  if (!campo || versao === 'normal') {
    if (campo && campo.includes('/')) {
      return campo.split('/')[0].trim();
    }
    return campo || '';
  }

  const partes = campo.split('/').map(p => p.trim());
  const normal = partes[0];

  if (partes.length === 1) return normal;

  if (versao === 'discente') {
    return partes[1] || normal;
  }

  if (versao === 'verdadeiro') {
    if (temDiscente && temVerdadeiro) {
      return partes[2] || normal;
    }
    return partes[1] || normal;
  }

  return normal;
}

export interface RitualCardProps {
  ritual: any;
  expandido: boolean;
  onToggleExpandir: () => void;
  versao: VersaoRitual;
  onMudarVersao: (versao: VersaoRitual) => void;
  simboloImg?: string;
  nivel: number;
  classe: string | null;
  afinidadeAtiva?: boolean;
  afinidadeEscolhida?: string | null;
  regrasAutomaticasAtivas?: Set<number>;
  poderesEscolhidos?: Record<string | number, any>;
  onProjetarMesa?: (nome: string, elemento: string, alcance: string, pe: number) => Promise<any> | void;
  onEditar?: () => void;
  onEsquecer?: () => void;
  onConjurar?: (params: ConjurarRitualParams) => ResultadoConjuracao;
  onRolarDano?: (nome: string, dados: string) => void;
}

export const RitualCard: React.FC<RitualCardProps> = ({
  ritual,
  expandido,
  onToggleExpandir,
  versao,
  onMudarVersao,
  simboloImg,
  nivel,
  classe,
  afinidadeAtiva = false,
  afinidadeEscolhida = null,
  regrasAutomaticasAtivas = new Set(),
  poderesEscolhidos = {},
  onProjetarMesa,
  onEditar,
  onEsquecer,
  onConjurar,
  onRolarDano,
}) => {
  const rpg = React.useContext(RPGContext);
  const status = rpg?.status;
  const atributosFinais = rpg?.atributosFinais;
  const condicoesAtivas = rpg?.condicoesAtivas || [];
  const conjurarRitualFn = onConjurar || rpg?.conjurarRitual;
  const rolarDanoFn = onRolarDano || rpg?.executarRolagemDano;
  const trilhasHook = rpg?.trilhasHook;

  const [feedbackConjuracao, setFeedbackConjuracao] = React.useState<ResultadoConjuracao | null>(null);

  React.useEffect(() => {
    if (!feedbackConjuracao) return;
    const timer = setTimeout(() => {
      setFeedbackConjuracao(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [feedbackConjuracao]);

  const isLista = ritual.Elemento_Ritual?.toLowerCase() === 'lista' || ritual.Elemento_Ritual?.toLowerCase() === 'varia';
  const elementoEscolhido = isLista ? (ritual.ElementoEscolhidoPermanente || 'Sangue') : ritual.Elemento_Ritual;

  const corPrimaria = obterCorElementoPrimario(elementoEscolhido);

  // Valores dinâmicos baseados na versão
  const peOriginal = ritual.customProps?.[versao]?.PE_Ritual || obterValorVersao(ritual.PE_Ritual, versao, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
  let peValor = parseInt(String(peOriginal).replace(/\D+/g, ''), 10);
  if (!isNaN(peValor)) {
    if (regrasAutomaticasAtivas.has(34)) {
      const temDesconto34 = Object.values(poderesEscolhidos).some((p: any) => p.codigoRegra === 34 && p.elemento === elementoEscolhido);
      if (temDesconto34) peValor -= 1;
    }
    if (regrasAutomaticasAtivas.has(35)) {
      const desconto35 = Object.values(poderesEscolhidos).filter((p: any) => p.codigoRegra === 35 && p.elemento === (ritual.customNome || ritual.Nome_Ritual)).length;
      peValor -= desconto35;
    }
    peValor = Math.max(1, peValor);
  }
  const pe = isNaN(peValor) ? peOriginal : String(peOriginal).replace(/\d+/, peValor.toString());
  const alcance = ritual.customProps?.[versao]?.Alcance_Ritual || obterValorVersao(ritual.Alcance_Ritual, versao, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
  const area = ritual.customProps?.[versao]?.Area_Ritual || obterValorVersao(ritual.Area_Ritual, versao, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
  const alvo = ritual.customProps?.[versao]?.Alvo_Ritual || obterValorVersao(ritual.Alvo_Ritual, versao, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
  const duracao = ritual.customProps?.[versao]?.Duracao_Ritual || obterValorVersao(ritual.Duracao_Ritual, versao, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
  const execucao = ritual.customProps?.[versao]?.Execucao_Ritual || obterValorVersao(ritual.Execucao_Ritual, versao, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
  const efeito = ritual.customProps?.[versao]?.Efeito_Ritual || obterValorVersao(ritual.Efeito_Ritual, versao, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
  const resistencia = ritual.customProps?.[versao]?.Resistencia_Ritual || obterValorVersao(ritual.Resistencia_Ritual, versao, ritual.Tem_Discente, ritual.Tem_Verdadeiro);
  const dados = ritual.customProps?.[versao]?.Dados_Ritual || obterValorVersao(ritual.Dados_Ritual, versao, ritual.Tem_Discente, ritual.Tem_Verdadeiro);

  // Cálculos de DT
  const peTurno = status?.peTurno ?? (nivel || 1);
  const isGraduado = Boolean(
    trilhasHook?.trilhaSelecionada?.Nome_Trilha?.toLowerCase().includes('graduado') ||
    trilhasHook?.versatilidadeSelecionada?.Nome_Trilha?.toLowerCase().includes('graduado')
  );
  const attrDT = isGraduado ? (atributosFinais?.INT ?? 0) : (atributosFinais?.PRE ?? 0);
  const dtResistencia = 10 + peTurno + attrDT;
  const dtCustoParanormal = 20 + (isNaN(peValor) ? 1 : peValor);

  // Validação de Conjuração
  const estaPerturbado = condicoesAtivas.includes('perturbado');
  const peAtual = status?.peAtual ?? 0;
  const peTemp = (status?.hasPeTemp ? status?.peTempAtual : 0) ?? 0;
  const peTotalDisponivel = peAtual + peTemp;
  const excedeLimiteTurno = !isNaN(peValor) && peValor > peTurno;
  const semPeSuficiente = !isNaN(peValor) && peTotalDisponivel < peValor;

  let motivoDesabilitado = '';
  if (estaPerturbado) {
    motivoDesabilitado = 'Não pode gastar PE voluntariamente enquanto Perturbado';
  } else if (excedeLimiteTurno) {
    motivoDesabilitado = `Custo (${peValor} PE) excede seu limite por turno (${peTurno} PE)`;
  } else if (semPeSuficiente) {
    motivoDesabilitado = `PE insuficiente (${peTotalDisponivel}/${peValor} PE)`;
  }

  const podeConjurar = !motivoDesabilitado && Boolean(conjurarRitualFn);

  const handleConjurar = () => {
    if (!podeConjurar || !conjurarRitualFn) return;
    const circuloNum = parseInt(String(ritual.Circulo_Ritual).replace(/\D+/g, ''), 10) || 1;
    const resultado = conjurarRitualFn({
      nome: ritual.customNome || ritual.Nome_Ritual,
      elemento: elementoEscolhido,
      custoPE: isNaN(peValor) ? 1 : peValor,
      versao,
      circulo: circuloNum,
      dadosEfeito: dados,
      alcance,
      resistencia,
    });
    setFeedbackConjuracao(resultado);
  };

  const handleRolarEfeito = () => {
    if (!rolarDanoFn || !dados) return;
    const expr = dados.includes('/') ? dados.split('/')[0].trim() : dados.trim();
    rolarDanoFn(
      ritual.customNome || ritual.Nome_Ritual,
      expr,
      2,
      false
    );
  };

  // Opções de versão disponíveis
  const reqNormal = verificarAcessoCirculo(ritual.Circulo_Ritual, nivel, classe);
  const versoesDisponiveis: { value: VersaoRitual; label: string; disabled?: boolean; title?: string }[] = [
    { 
      value: 'normal', 
      label: 'Normal',
      disabled: !reqNormal.atende
    },
  ];
  if (ritual.Tem_Discente) {
    const req = verificarRequisitoRitual(ritual.Requisito_Discente, nivel, classe, afinidadeAtiva, afinidadeEscolhida, ritual.Elemento_Ritual);
    versoesDisponiveis.push({ 
      value: 'discente', 
      label: 'Discente',
      disabled: !req.atende
    });
  }
  if (ritual.Tem_Verdadeiro) {
    const req = verificarRequisitoRitual(ritual.Requisito_Verdadeiro, nivel, classe, afinidadeAtiva, afinidadeEscolhida, ritual.Elemento_Ritual);
    versoesDisponiveis.push({ 
      value: 'verdadeiro', 
      label: 'Verdadeiro',
      disabled: !req.atende
    });
  }

  return (
    <div className="overflow-hidden rounded-r border-l-4 bg-zinc-900/70" style={{ borderLeftColor: corPrimaria }}>
      {/* ══════ CABEÇALHO (sempre visível) ══════ */}
      <div
        onClick={onToggleExpandir}
        className="flex cursor-pointer items-center justify-between gap-2 bg-zinc-800/60 px-4 py-3 transition hover:bg-zinc-700/50"
      >
        <div className="flex items-center">
          {simboloImg && (
            <>
              <div
                className="overflow-hidden shrink-0 flex items-center justify-center"
                style={{
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  width: expandido ? '0px' : '64px',
                  height: '64px',
                  marginTop: '-6px',
                  marginBottom: '-6px',
                  opacity: expandido ? 0 : 1,
                }}
              >
                <img
                  src={simboloImg}
                  loading="lazy"
                  alt=""
                  className="h-16 w-16 object-contain drop-shadow-md max-w-none"
                />
              </div>
              <div
                className="shrink-0 bg-white/20 rounded-full"
                style={{
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  width: expandido ? '0px' : '1px',
                  height: '36px',
                  marginLeft: expandido ? '0px' : '10px',
                  marginRight: expandido ? '0px' : '10px',
                  opacity: expandido ? 0 : 1,
                }}
              />
            </>
          )}
          <div className="flex flex-col gap-1 justify-center py-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-zinc-100">{ritual.customNome || ritual.Nome_Ritual}</span>
              <span className="rounded bg-blue-950/30 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-900/50">
                {pe} PE
              </span>
              {conjurarRitualFn && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConjurar();
                  }}
                  disabled={!podeConjurar}
                  title={podeConjurar ? `Conjurar ${ritual.customNome || ritual.Nome_Ritual} (${peValor} PE)` : motivoDesabilitado}
                  className="inline-flex items-center gap-1 rounded bg-purple-950/70 hover:bg-purple-900/90 border border-purple-700/60 hover:border-purple-500 px-2 py-0.5 text-[10px] font-bold text-purple-200 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <span>🔮</span>
                  <span>Conjurar</span>
                </button>
              )}
            </div>
            {/* Dados abaixo do título — todas as versões, ativa acesa */}
            {ritual.Dados_Ritual && (() => {
              const partesDados = ritual.Dados_Ritual.split('/').map((p: string) => p.trim());
              const normal = partesDados[0];
              if (partesDados.length === 1 && normal) {
                return <span className="text-sm font-bold text-zinc-100">{normal}</span>;
              }
              const preenchidas = partesDados.map((p: string) => p || normal);
              if (!preenchidas.some((p: string) => p)) return null;
              let ativo = 0;
              if (versao === 'discente') ativo = 1;
              if (versao === 'verdadeiro') {
                ativo = (ritual.Tem_Discente && ritual.Tem_Verdadeiro) ? 2 : 1;
              }
              return (
                <div className="flex items-center gap-2">
                  {preenchidas.map((parte: string, idx: number) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-xs text-zinc-700">›</span>}
                      <span
                        className={`text-sm font-bold transition-all duration-300 ${idx === ativo ? 'text-zinc-100' : 'text-zinc-600'}`}
                      >
                        {parte}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="flex flex-col justify-between shrink-0 ml-2 items-end pb-1 pt-0 mt-[-4px]">
          {/* Badge do elemento (Padrão 2: tags inline) */}
          <span
            className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 uppercase tracking-wider leading-tight ${
              (() => {
                const elStr = String(elementoEscolhido || '').toLowerCase();
                if (elStr.includes('medo')) return 'bg-zinc-200/80 text-zinc-950 px-1';
                if (elStr.includes('sangue')) return 'text-red-500';
                if (elStr.includes('morte')) return 'bg-black/50 text-white px-1';
                if (elStr.includes('conhecimento')) return 'text-yellow-500';
                if (elStr.includes('energia')) return 'text-purple-500';
                return 'text-zinc-400';
              })()
            }`}
          >
            <span className="text-[9px] font-bold">{elementoEscolhido}</span>
            <span className="text-[11px] font-black">{ritual.Circulo_Ritual}</span>
          </span>

          <div className={`flex items-center gap-2 ${simboloImg ? 'mt-auto' : 'mt-2'}`}>
            <span className="text-xs text-zinc-600 ml-1">{expandido ? '▲' : '▼'}</span>
          </div>
        </div>
      </div>
      
      {/* ══════ CONTEÚDO EXPANDIDO ══════ */}
      <Collapse isOpen={expandido}>
        <div className="border-t border-zinc-800 px-4 py-4 text-left text-sm leading-relaxed text-zinc-400">
          
          {/* ══ BARRA DE CONJURAÇÃO & DADOS ══ */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-zinc-950/80 p-2.5 border border-zinc-800">
            <div className="flex items-center gap-2 flex-wrap">
              {conjurarRitualFn && (
                <button
                  type="button"
                  onClick={handleConjurar}
                  disabled={!podeConjurar}
                  title={podeConjurar ? `Conjurar ${ritual.customNome || ritual.Nome_Ritual} (${peValor} PE)` : motivoDesabilitado}
                  className="inline-flex items-center gap-1.5 rounded bg-purple-900/80 hover:bg-purple-800 border border-purple-700 px-3 py-1.5 text-xs font-bold text-purple-100 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed shadow"
                >
                  <span>🔮</span>
                  <span>Conjurar ({peValor} PE)</span>
                </button>
              )}

              {dados && rolarDanoFn && (
                <button
                  type="button"
                  onClick={handleRolarEfeito}
                  className="inline-flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1.5 text-xs font-bold text-zinc-200 hover:text-white transition shadow"
                  title={`Rolar dados do efeito: ${dados}`}
                >
                  <span>🎲</span>
                  <span>Rolar Efeito ({dados})</span>
                </button>
              )}
            </div>

            {/* DTs Informativas */}
            <div className="flex items-center gap-2 flex-wrap">
              {resistencia && resistencia.toLowerCase() !== 'nenhuma' && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-amber-950/30 border border-amber-900/50 text-[11px] font-bold text-amber-300"
                  title={`DT do Ritual = 10 + Limite PE por Turno (${peTurno}) + ${isGraduado ? 'INT' : 'PRE'} (${attrDT})`}
                >
                  <span className="text-zinc-400 font-normal">Resistência:</span>
                  <span>DT {dtResistencia}</span>
                </div>
              )}

              <div
                className="flex items-center gap-1 px-2 py-1 rounded bg-purple-950/30 border border-purple-900/50 text-[11px] font-bold text-purple-300"
                title="Custo do Paranormal (Ordem Paranormal pág. 118): Teste de Ocultismo (INT) contra DT 20 + PE gastos. Se falhar, perde SAN igual ao PE gasto."
              >
                <span className="text-zinc-400 font-normal">Custo Paranormal:</span>
                <span>DT {dtCustoParanormal}</span>
              </div>
            </div>
          </div>

          {/* Banner de Feedback da Conjuração */}
          {feedbackConjuracao && (
            <div
              className={`mb-4 p-2.5 rounded text-xs border flex items-center justify-between gap-2 shadow-md transition-all ${
                feedbackConjuracao.sucesso
                  ? feedbackConjuracao.sucessoCustoParanormal
                    ? 'bg-emerald-950/50 border-emerald-700 text-emerald-200'
                    : 'bg-amber-950/50 border-amber-700 text-amber-200'
                  : 'bg-red-950/50 border-red-700 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {feedbackConjuracao.sucesso
                    ? feedbackConjuracao.sucessoCustoParanormal
                      ? '✨'
                      : '⚡'
                    : '⚠️'}
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold">{feedbackConjuracao.mensagem}</span>
                  {feedbackConjuracao.resultadoTesteOcultismo && (
                    <span className="text-[10px] text-zinc-400 mt-0.5">
                      Teste de Ocultismo rolado: {feedbackConjuracao.resultadoTesteOcultismo.total} (Total) vs DT {dtCustoParanormal}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackConjuracao(null)}
                className="text-zinc-400 hover:text-zinc-200 text-xs px-1 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col flex-1 min-w-0">
              
              {/* Dropdown de Versão */}
              {versoesDisponiveis.length > 1 && (
                <div className="mb-4 flex flex-wrap items-center justify-between border-b border-zinc-800/50 pb-3">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-600">Versão:</span>
                      <CustomSelect
                        value={versao}
                        onChange={(val) => onMudarVersao(val as VersaoRitual)}
                        wrapperClassName="w-[120px]"
                        className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs font-bold text-zinc-200 outline-none transition hover:bg-zinc-800 focus:border-green-700"
                        options={versoesDisponiveis.map(v => ({ value: v.value, label: v.label, disabled: v.disabled }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos de metadados — só mostram se têm valor */}
              <div className="mb-4 flex flex-col gap-1">
                {execucao && (
                  <div className="text-xs">
                    <span className="font-bold text-zinc-300">Execução: </span>
                    <span className="text-zinc-400">{execucao}</span>
                  </div>
                )}
                {alcance && (
                  <div className="text-xs">
                    <span className="font-bold text-zinc-300">Alcance: </span>
                    <span className="text-zinc-400">{alcance}</span>
                  </div>
                )}
                {area && (
                  <div className="text-xs">
                    <span className="font-bold text-zinc-300">Área: </span>
                    <span className="text-zinc-400">{area}</span>
                  </div>
                )}
                {alvo && (
                  <div className="text-xs">
                    <span className="font-bold text-zinc-300">Alvo: </span>
                    <span className="text-zinc-400">{alvo}</span>
                  </div>
                )}
                {duracao && (
                  <div className="text-xs">
                    <span className="font-bold text-zinc-300">Duração: </span>
                    <span className="text-zinc-400">{duracao}</span>
                  </div>
                )}
                {efeito && (
                  <div className="text-xs">
                    <span className="font-bold text-zinc-300">Efeito: </span>
                    <span className="text-zinc-400">{efeito}</span>
                  </div>
                )}
                {resistencia && (
                  <div className="text-xs flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-zinc-300">Resistência: </span>
                    <span className="text-zinc-400">{resistencia}</span>
                    {resistencia.toLowerCase() !== 'nenhuma' && (
                      <span
                        className="ml-1 rounded bg-amber-950/40 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-900/50"
                        title={`DT = 10 + PE/Turno (${peTurno}) + ${isGraduado ? 'INT' : 'PRE'} (${attrDT})`}
                      >
                        DT {dtResistencia}
                      </span>
                    )}
                  </div>
                )}
                {dados && (
                  <div className="text-xs flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-zinc-300">Dados: </span>
                    <span className="text-zinc-400 font-mono">{dados}</span>
                    {rolarDanoFn && (
                      <button
                        type="button"
                        onClick={handleRolarEfeito}
                        className="ml-1 inline-flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 underline font-bold"
                        title="Rolar dados no Dice Tray"
                      >
                        🎲 rolar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Símbolo do Ritual Centralizado Verticalmente */}
            {simboloImg && (
              <img
                src={simboloImg}
                alt=""
                className="w-32 h-32 sm:w-40 sm:h-40 mr-2 sm:mr-6 object-contain shrink-0 drop-shadow-lg"
              />
            )}
          </div>

          {/* Descrição formatada com versões dimmed */}
          <div className="text-sm leading-relaxed text-zinc-400 border-t border-zinc-800/50 pt-3">
            {(() => {
              let currentScope = 'normal';
              const textoDesc = ritual.customDesc || ritual.Descricao_Ritual || '';
              return textoDesc.split('\n').map((linha: string, i: number) => {
                const linhaLower = linha.trim().toLowerCase();
                const isHeaderDiscente = linhaLower.startsWith('*discente') || linhaLower.startsWith('discente');
                const isHeaderVerdadeiro = linhaLower.startsWith('*verdadeiro') || linhaLower.startsWith('verdadeiro');

                if (isHeaderDiscente) currentScope = 'discente';
                if (isHeaderVerdadeiro) currentScope = 'verdadeiro';

                let dimmed = false;
                if (currentScope === 'discente' && versao !== 'discente') dimmed = true;
                if (currentScope === 'verdadeiro' && versao !== 'verdadeiro') dimmed = true;

                return (
                  <span
                    key={i}
                    className={`block ${dimmed ? 'opacity-50' : ''} ${currentScope !== 'normal' && !dimmed ? 'text-zinc-300' : ''}`}
                    style={{ transition: 'opacity 0.2s ease' }}
                    dangerouslySetInnerHTML={{ __html: formatarDescricao(linha) }}
                  />
                );
              });
            })()}
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-zinc-800/50 pt-3">
            {onProjetarMesa && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const nomeRitual = ritual.customNome || ritual.Nome_Ritual;
                  onProjetarMesa(nomeRitual, elementoEscolhido, alcance || 'Curto', peValor || 1);
                }}
                className="rounded bg-red-950/80 border border-red-700/60 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-red-200 transition hover:bg-red-800 hover:text-white flex items-center gap-1.5"
                title="Projetar o Símbolo e o Alcance deste Ritual no Tabuleiro Digital (Unreal Engine)"
              >
                <span>🎲</span>
                <span>Projetar na Mesa</span>
              </button>
            )}
            {onEditar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditar();
                }}
                className="rounded bg-zinc-800 border border-zinc-700 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-100"
              >
                Editar Ritual
              </button>
            )}
            {onEsquecer && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEsquecer();
                }}
                className="rounded bg-green-900/30 border border-green-800 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-green-500 transition hover:bg-green-900/50 hover:text-green-400"
              >
                Esquecer Ritual
              </button>
            )}
          </div>

        </div>
      </Collapse>
    </div>
  );
};
