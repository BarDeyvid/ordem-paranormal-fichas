import React from 'react';
import { Collapse } from './Collapse';
import { CustomSelect } from './CustomSelect';
import { formatarDescricao } from '../utils/formatters';
import { verificarRequisitoRitual, verificarAcessoCirculo } from '../utils/rpgRules';
import type { VersaoRitual } from '../types';

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
}) => {
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
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-100">{ritual.customNome || ritual.Nome_Ritual}</span>
              <span className="rounded bg-blue-950/30 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-900/50">
                {pe} PE
              </span>
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
                  <div className="text-xs">
                    <span className="font-bold text-zinc-300">Resistência: </span>
                    <span className="text-zinc-400">{resistencia}</span>
                  </div>
                )}
                {dados && (
                  <div className="text-xs">
                    <span className="font-bold text-zinc-300">Dados: </span>
                    <span className="text-zinc-400">{dados}</span>
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
