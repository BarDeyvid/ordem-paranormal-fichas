import React, { useCallback } from 'react';
import { useRPG } from '../../context/RPGContext';
import { NEX_OPTIONS, CORES_ELEMENTOS, obterElementoOpressor } from '../../utils/rpgRules';
import { ModalAfinidade } from '../../components/ModalAfinidade';
import { CustomSelect } from '../../components/CustomSelect';
import { BarraStatus } from '../../components/BarraStatus';
import { CONDICOES_MAP } from '../../data/condicoes';

const NIVEL_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);

export const StatusPanel: React.FC = () => {
  const {
    status,
    nex,
    setNex,
    bloquearLetras,
    deslocM, setDeslocM,
    deslocQ, setDeslocQ,
    regras,
    nivel, setNivel,
    afinidadeEscolhida, setAfinidadeEscolhida,
    afinidadeAtiva,
    poderesHook,
    origensHook,
    regrasAutomaticasAtivas,
    escolhaRegra53, setEscolhaRegra53,
    bonusVestimentas,
    bonusMaldicoes,
    condicoesAtivas,
    removerCondicao,
    setModalCondicoesAberto,
    penalidadesCondicoes,
    estadoSobrevivencia,
    estabilizarMorrendo,
    estabilizarEnlouquecendo,
    registrarFalhaMorte,
    executarRolagemPericia,
    periciasHook,
  } = useRPG();

  const regraNexExperiencia = regras['nex_experiencia'];
  const regraSemSanidade = regras['sem_sanidade'];

  const {
    pvAtual, pvMax, setPvMax, setPvAtual,
    sanAtual, sanMax, setSanMax, setSanAtual,
    peAtual, peMax, setPeMax, setPeAtual,
    pdAtual, pdMax, setPdMax, setPdAtual,
    hasPdTemp, setHasPdTemp,
    pdTempAtual, setPdTempAtual, pdTempMax, setPdTempMax,
    peTurno,
    hasPvTemp, setHasPvTemp,
    pvTempAtual, setPvTempAtual, pvTempMax, setPvTempMax,
    hasPeTemp, setHasPeTemp,
    peTempAtual, setPeTempAtual, peTempMax, setPeTempMax,
    alterarStatus,
  } = status;

  // 🔥 NOVA FUNÇÃO: altera valor atual considerando temporário
  const alterarPvComTemp = useCallback((qtd: number) => {
    if (qtd >= 0) {
      // Cura: vai direto pro PV atual (não afeta temporário)
      setPvAtual(prev => Math.max(0, Math.min(pvMax, (prev ?? 0) + qtd)));
    } else {
      // Dano: primeiro absorve pelo temporário
      let danoRestante = Math.abs(qtd);

      if (hasPvTemp && pvTempAtual > 0) {
        const absorvido = Math.min(pvTempAtual, danoRestante);
        setPvTempAtual(prev => Math.max(0, prev - absorvido));
        danoRestante -= absorvido;
      }

      if (danoRestante > 0) {
        setPvAtual(prev => Math.max(0, Math.min(pvMax, (prev ?? 0) - danoRestante)));
      }
    }
  }, [pvMax, hasPvTemp, pvTempAtual, setPvAtual, setPvTempAtual]);

  // 🔥 NOVA FUNÇÃO: altera PE considerando temporário
  const alterarPeComTemp = useCallback((qtd: number) => {
    if (qtd >= 0) {
      // Recuperação: vai direto pro PE atual
      setPeAtual(prev => Math.max(0, Math.min(peMax, (prev ?? 0) + qtd)));
    } else {
      // Gasto: primeiro absorve pelo temporário
      let danoRestante = Math.abs(qtd);

      if (hasPeTemp && peTempAtual > 0) {
        const absorvido = Math.min(peTempAtual, danoRestante);
        setPeTempAtual(prev => Math.max(0, prev - absorvido));
        danoRestante -= absorvido;
      }

      if (danoRestante > 0) {
        setPeAtual(prev => Math.max(0, Math.min(peMax, (prev ?? 0) - danoRestante)));
      }
    }
  }, [peMax, hasPeTemp, peTempAtual, setPeAtual, setPeTempAtual]);

  const bonusFortitude = (periciasHook?.pericias?.['Fortitude']?.treino || 0) + (periciasHook?.pericias?.['Fortitude']?.outros || 0);
  const handleTesteMorte = useCallback(() => {
    const res = executarRolagemPericia('Fortitude', 'VIG', bonusFortitude);
    if (res.total >= 20) {
      estabilizarMorrendo();
    } else {
      if (res.total <= 15) {
        registrarFalhaMorte();
        registrarFalhaMorte();
        registrarFalhaMorte();
      } else {
        registrarFalhaMorte();
      }
    }
  }, [bonusFortitude, executarRolagemPericia, estabilizarMorrendo, registrarFalhaMorte]);

  const bonusVontade = (periciasHook?.pericias?.['Vontade']?.treino || 0) + (periciasHook?.pericias?.['Vontade']?.outros || 0);
  const handleTesteSanidade = useCallback(() => {
    const res = executarRolagemPericia('Vontade', 'PRE', bonusVontade);
    if (res.total >= 20) {
      estabilizarEnlouquecendo();
    }
  }, [bonusVontade, executarRolagemPericia, estabilizarEnlouquecendo]);

  return (
    <div>
      {/* LINHA: NEX + PE/TURNO + AFINIDADE + DESLOCAMENTO */}
      <div className="mb-8 flex flex-wrap items-start gap-2 sm:gap-4 justify-between sm:justify-start border-b border-zinc-800 pb-5">
        {/* NÍVEL (se regra ativa) */}
        {regraNexExperiencia && (
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative z-50 w-full">
              <CustomSelect
                value={(NIVEL_OPTIONS.includes(nivel) ? nivel : Math.max(1, nivel)).toString()}
                onChange={(val) => setNivel(Number(val))}
                options={NIVEL_OPTIONS.map(n => ({ value: n.toString(), label: n.toString() }))}
                wrapperClassName="w-20"
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nível</span>
          </div>
        )}

        {/* PE/TURNO */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex h-9 min-w-[3.5rem] items-center justify-center rounded border border-zinc-600 px-3 text-base font-bold text-zinc-100">
            {peTurno}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">PE/Turno</span>
        </div>

        {/* AFINIDADE */}
        {afinidadeAtiva && afinidadeEscolhida && (
          <div className="flex flex-col items-center gap-1.5">
            <div 
              className="group relative flex h-9 cursor-help items-center justify-center rounded border px-3 text-xs font-bold uppercase tracking-wider text-zinc-100 transition"
              style={{
                borderColor: CORES_ELEMENTOS[afinidadeEscolhida.toLowerCase()] || '#888',
                backgroundColor: `${CORES_ELEMENTOS[afinidadeEscolhida.toLowerCase()] || '#888'}40`,
                color: '#ffffff'
              }}
            >
              {afinidadeEscolhida}
              <button 
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-400 opacity-0 transition hover:bg-green-900 hover:text-white group-hover:opacity-100"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setAfinidadeEscolhida(null); 
                  const nexElementais = [60, 75, 90];
                  nexElementais.forEach(n => {
                    const chave = n + 1000;
                    if (poderesHook.poderesEscolhidos[chave]) {
                      poderesHook.removerPoder(chave);
                    }
                  });
                }}
                title="Trocar Afinidade"
              >
                &#8634;
              </button>
              {/* TOOLTIP */}
              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded border border-zinc-700 bg-zinc-950 p-3 text-left text-xs font-normal text-zinc-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                <div className="mb-2 border-b border-zinc-800 pb-2">
                  <strong className="text-zinc-100">Você está conectado à entidade de {afinidadeEscolhida}</strong>
                </div>
                <ul className="flex list-disc flex-col gap-2 pl-4">
                  <li>Não precisa de componentes ritualísticos para conjurar rituais deste elemento.</li>
                  <li>Pode aprender rituais que exigem afinidade com este elemento.</li>
                  <li>Recebe +2d20 em testes contra efeitos de {afinidadeEscolhida}. Sofre -2d20 em testes contra efeitos de {obterElementoOpressor(afinidadeEscolhida)}.</li>
                  <li>Pode escolher poderes paranormais deste elemento uma segunda vez para receber o benefício listado na linha "Afinidade".</li>
                </ul>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Afinidade</span>
          </div>
        )}

        {/* DESLOCAMENTO */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex h-9 items-center justify-center rounded border border-zinc-600 px-2.5 text-base font-bold text-zinc-100">
            <input
              type="number"
              value={(() => {
                const bonusDesloc = (regrasAutomaticasAtivas.has(12) ? 3 : 0) + (regrasAutomaticasAtivas.has(22) ? 3 : 0) + (regrasAutomaticasAtivas.has(41) ? 3 : 0) + (bonusVestimentas?.deslocamento || 0) + (bonusMaldicoes?.deslocamento || 0);
                let baseM = deslocM + bonusDesloc;
                if (penalidadesCondicoes.deslocamentoFixo !== null) {
                  baseM = penalidadesCondicoes.deslocamentoFixo;
                } else {
                  baseM = Math.floor(baseM * penalidadesCondicoes.deslocamentoMultiplicador);
                }
                return baseM;
              })()}
              onChange={(e) => {
                const bonusDesloc = (regrasAutomaticasAtivas.has(12) ? 3 : 0) + (regrasAutomaticasAtivas.has(22) ? 3 : 0) + (regrasAutomaticasAtivas.has(41) ? 3 : 0) + (bonusVestimentas?.deslocamento || 0) + (bonusMaldicoes?.deslocamento || 0);
                const totalM = Number(e.target.value);
                const m = totalM - bonusDesloc;
                setDeslocM(m);
                setDeslocQ(Math.floor(m / 1.5));
              }}
              className="w-9 bg-transparent text-center font-bold text-zinc-100 outline-none"
            />
            <span className="text-sm text-zinc-400">m /</span>
            <input
              type="number"
              value={(() => {
                const bonusDesloc = (regrasAutomaticasAtivas.has(12) ? 3 : 0) + (regrasAutomaticasAtivas.has(22) ? 3 : 0) + (regrasAutomaticasAtivas.has(41) ? 3 : 0) + (bonusVestimentas?.deslocamento || 0) + (bonusMaldicoes?.deslocamento || 0);
                let baseM = deslocM + bonusDesloc;
                if (penalidadesCondicoes.deslocamentoFixo !== null) {
                  baseM = penalidadesCondicoes.deslocamentoFixo;
                } else {
                  baseM = Math.floor(baseM * penalidadesCondicoes.deslocamentoMultiplicador);
                }
                return Math.floor(baseM / 1.5);
              })()}
              onChange={(e) => {
                const bonusDesloc = (regrasAutomaticasAtivas.has(12) ? 3 : 0) + (regrasAutomaticasAtivas.has(22) ? 3 : 0) + (regrasAutomaticasAtivas.has(41) ? 3 : 0) + (bonusVestimentas?.deslocamento || 0) + (bonusMaldicoes?.deslocamento || 0);
                const bonusDeslocQ = Math.floor(bonusDesloc / 1.5);
                const totalQ = Number(e.target.value);
                const q = totalQ - bonusDeslocQ;
                setDeslocQ(q);
                setDeslocM(q * 1.5);
              }}
              className="w-9 bg-transparent text-center font-bold text-zinc-100 outline-none"
            />
            <span className="text-sm text-zinc-400">q</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Deslocamento</span>
        </div>
      </div>

      {/* BARRAS DE STATUS */}
      <div className="mb-8 flex flex-col gap-6">
        {/* VIDA — usa a função com temporário */}
        <BarraStatus
          titulo="Vida"
          corBarra="border-red-700 bg-red-950/40"
          corTempClasses="border-red-500 bg-red-950/20"
          valorAtual={pvAtual}
          setValorAtual={setPvAtual as React.Dispatch<React.SetStateAction<number>>}
          valorMax={pvMax}
          setValorMax={setPvMax}
          alterarStatus={alterarPvComTemp} // ← TROCADO
          bloquearLetras={bloquearLetras}
          hasTemp={hasPvTemp}
          setHasTemp={setHasPvTemp}
          tempAtual={pvTempAtual}
          setTempAtual={setPvTempAtual}
          tempMax={pvTempMax}
          setTempMax={setPvTempMax}
        />

        {/* UI Regra 53 (Sangue Ruim) */}
        {regrasAutomaticasAtivas.has(53) && pvAtual !== null && pvAtual <= Math.floor(pvMax / 2) && (
          <div className="mt-2 flex flex-col items-center gap-2.5 rounded-lg border border-red-900/50 bg-zinc-900/80 p-3 shadow-[0_0_10px_rgba(153,27,27,0.1)]">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">
              Sangue Fervente (Machucado)
            </span>
            {!escolhaRegra53 ? (
              <div className="flex w-full gap-2">
                <button
                  onClick={() => setEscolhaRegra53('FOR')}
                  className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-bold text-zinc-400 transition hover:border-red-900 hover:text-red-500 hover:bg-red-950/20"
                >
                  + FORÇA
                </button>
                <button
                  onClick={() => setEscolhaRegra53('AGI')}
                  className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-bold text-zinc-400 transition hover:border-red-900 hover:text-red-500 hover:bg-red-950/20"
                >
                  + AGILIDADE
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between rounded-md border border-red-900/30 bg-red-950/20 px-4 py-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Bônus Ativo:
                </span>
                <span className="text-sm font-bold text-red-500">
                  +{regrasAutomaticasAtivas.has(54) ? 2 : 1} {escolhaRegra53 === 'FOR' ? 'Força' : 'Agilidade'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* SANIDADE — não tem temporário */}
        {!regraSemSanidade && (
          <BarraStatus
            titulo="Sanidade"
            corBarra="border-zinc-300 bg-zinc-800/60"
            valorAtual={sanAtual}
            setValorAtual={setSanAtual as React.Dispatch<React.SetStateAction<number>>}
            valorMax={sanMax}
            setValorMax={setSanMax}
            alterarStatus={(qtd) => alterarStatus('san', qtd)}
            bloquearLetras={bloquearLetras}
          />
        )}

        {/* ESFORÇO — usa a função com temporário */}
        {!regraSemSanidade && (
          <BarraStatus
            titulo="Esforço"
            corBarra="border-amber-600 bg-amber-950/40"
            corTempClasses="border-amber-400 bg-amber-950/20"
            valorAtual={peAtual}
            setValorAtual={setPeAtual as React.Dispatch<React.SetStateAction<number>>}
            valorMax={peMax}
            setValorMax={setPeMax}
            alterarStatus={alterarPeComTemp}
            bloquearLetras={bloquearLetras}
            hasTemp={hasPeTemp}
            setHasTemp={setHasPeTemp}
            tempAtual={peTempAtual}
            setTempAtual={setPeTempAtual}
            tempMax={peTempMax}
            setTempMax={setPeTempMax}
          />
        )}

        {/* PD (Pontos de Determinação) — regra Jogando sem Sanidade */}
        {regraSemSanidade && (
          <BarraStatus
            titulo="Determinação"
            corBarra="border-purple-500 bg-purple-950/40"
            corTempClasses="border-purple-400 bg-purple-950/20"
            valorAtual={pdAtual}
            setValorAtual={setPdAtual as React.Dispatch<React.SetStateAction<number>>}
            valorMax={pdMax}
            setValorMax={setPdMax}
            alterarStatus={(qtd) => alterarStatus('pd', qtd)}
            bloquearLetras={bloquearLetras}
            hasTemp={hasPdTemp}
            setHasTemp={setHasPdTemp}
            tempAtual={pdTempAtual}
            setTempAtual={setPdTempAtual}
            tempMax={pdTempMax}
            setTempMax={setPdTempMax}
          />
        )}
      </div>

      {/* BANNER DE EMERGÊNCIA: MORRENDO */}
      {estadoSobrevivencia.morrendo && (
        <div className="mb-4 rounded-lg border-2 border-red-600 bg-red-950/80 p-3.5 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl animate-bounce">☠️</span>
              <div>
                <h4 className="font-display text-sm font-black uppercase tracking-wider text-red-300">
                  Estado Crítico: Morrendo!
                </h4>
                <p className="text-[11px] text-red-200/80">
                  O agente está inconsciente (0 PV). Falhas de morte: {estadoSobrevivencia.falhasMorte}/3
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((num) => (
                <span
                  key={num}
                  className={`h-5 w-5 rounded-full border flex items-center justify-center text-[10px] font-black ${
                    estadoSobrevivencia.falhasMorte >= num
                      ? 'bg-red-600 border-red-400 text-white'
                      : 'border-red-900 bg-red-950/60 text-red-700'
                  }`}
                >
                  ✕
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleTesteMorte}
              className="flex-1 rounded bg-red-600 hover:bg-red-500 py-1.5 px-3 text-xs font-bold uppercase tracking-wider text-white shadow transition flex items-center justify-center gap-1.5"
            >
              <span>🎲</span>
              <span>Teste de Morte (Fortitude DT 20)</span>
            </button>
            <button
              type="button"
              onClick={estabilizarMorrendo}
              className="rounded bg-zinc-800 hover:bg-zinc-700 py-1.5 px-3 text-xs font-bold uppercase tracking-wider text-zinc-200 border border-zinc-700 transition"
              title="Estabilizado por socorro médico ou cura"
            >
              Estabilizar (1 PV)
            </button>
          </div>
        </div>
      )}

      {/* BANNER DE EMERGÊNCIA: ENLOUQUECENDO */}
      {estadoSobrevivencia.enlouquecendo && (
        <div className="mb-4 rounded-lg border-2 border-purple-600 bg-purple-950/80 p-3.5 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl animate-bounce">🕳️</span>
              <div>
                <h4 className="font-display text-sm font-black uppercase tracking-wider text-purple-300">
                  Colapso Mental: Enlouquecendo!
                </h4>
                <p className="text-[11px] text-purple-200/80">
                  A mente do agente está sendo absorvida pelo Outro Lado (0 SAN).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleTesteSanidade}
              className="flex-1 rounded bg-purple-600 hover:bg-purple-500 py-1.5 px-3 text-xs font-bold uppercase tracking-wider text-white shadow transition flex items-center justify-center gap-1.5"
            >
              <span>🧠</span>
              <span>Teste de Lucidez (Vontade DT 20)</span>
            </button>
            <button
              type="button"
              onClick={estabilizarEnlouquecendo}
              className="rounded bg-zinc-800 hover:bg-zinc-700 py-1.5 px-3 text-xs font-bold uppercase tracking-wider text-zinc-200 border border-zinc-700 transition"
              title="Conter delírio com apoio de aliados"
            >
              Conter Delírio (1 SAN)
            </button>
          </div>
        </div>
      )}

      {/* SEÇÃO DE CONDIÇÕES & ESTADOS PARANORMAIS */}
      <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">🩹</span>
            <span className="font-display text-xs font-bold uppercase tracking-wider text-zinc-300">
              Condições Ativas ({condicoesAtivas.length})
            </span>
            {penalidadesCondicoes.penalidadeDefesa !== 0 && (
              <span className="rounded bg-red-950/60 border border-red-800/80 px-1.5 py-0.2 text-[10px] font-bold text-red-400">
                Def {penalidadesCondicoes.penalidadeDefesa}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setModalCondicoesAberto(true)}
            className="rounded bg-zinc-800 hover:bg-emerald-950/60 border border-zinc-700 hover:border-emerald-700/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-200 hover:text-emerald-400 transition flex items-center gap-1"
          >
            <span>+</span>
            <span>Gerenciar</span>
          </button>
        </div>

        {condicoesAtivas.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-1">
            Nenhuma condição ativa no momento.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {condicoesAtivas.map(id => {
              const c = CONDICOES_MAP[id];
              if (!c) return null;
              return (
                <div
                  key={id}
                  className="group flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/90 pl-2 pr-1.5 py-0.5 text-xs text-zinc-200 shadow-sm transition hover:border-zinc-500"
                  title={`${c.nome}: ${c.resumoEfeito}`}
                >
                  <span className="text-xs select-none">{c.icone}</span>
                  <span 
                    className="font-bold cursor-pointer hover:underline"
                    onClick={() => setModalCondicoesAberto(true)}
                  >
                    {c.nome}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removerCondicao(id);
                    }}
                    className="ml-0.5 rounded-full text-zinc-500 hover:text-red-400 hover:bg-zinc-800 p-0.5 transition"
                    title={`Remover ${c.nome}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {nex >= 50 && afinidadeEscolhida === null && (
        <ModalAfinidade 
          onEscolher={setAfinidadeEscolhida}
          forcarEscolha={true}
        />
      )}
    </div>
  );
};