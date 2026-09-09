import React from 'react';
import { useRPG } from '../context/RPGContext';
import { proficienciasIniciais } from '../utils/rpgRules';
import type { ClasseRPG } from '../types';

export const ClasseScreen: React.FC = () => {
  const {
    setClasse,
    setTelaAtual,
    skillCombatente1,
    setSkillCombatente1,
    setSkillCombatente2,
    skillCombatente2,
    setProficiencias,
  } = useRPG();

  const combatentePronto = skillCombatente1 !== '' && skillCombatente2 !== '';

  const escolherClasse = (novaClasse: ClasseRPG) => {
    if (!novaClasse) return;

    setClasse(novaClasse);
    setProficiencias(proficienciasIniciais(novaClasse));
    setTelaAtual('ficha');
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <h1 className="font-display mb-2 text-center text-3xl uppercase tracking-wide text-zinc-100">
        Escolha sua Classe
      </h1>
      <p className="mb-6 text-center text-sm uppercase tracking-widest text-green-600">
        Passo 3 — Seu papel na Ordem
      </p>

      <div className="mx-auto mb-10 max-w-4xl text-center text-sm leading-relaxed text-zinc-400">
        <p className="mb-2">
          Sua classe indica o treinamento que você recebeu na Ordem para enfrentar os perigos do Outro Lado. Em termos de jogo, é a sua característica mais importante, pois define o que você faz e qual é o seu papel no grupo de investigadores.
        </p>
        <p>
          Ordem Paranormal RPG contém três classes, que representam os principais arquétipos de heróis em histórias de terror e suspense:
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-5 lg:flex-row">
        {/* COMBATENTE — Sangue */}
        <div className="flex flex-1 flex-col rounded-xl border border-green-900/60 bg-zinc-900/60 p-6 transition hover:border-green-700">
          <h2 className="font-display mb-3 text-center text-xl uppercase tracking-wide text-green-500">
            Combatente
          </h2>
          <p className="flex-grow text-sm leading-relaxed text-zinc-400 text-center">
            Treinado para lutar com todo tipo de armas, e com a força e a coragem para encarar os perigos de frente, É o tipo de agente que prefere abordagens mais diretas e costuma atirar primeiro e perguntar depois.
          </p>

          <div className="my-5 flex min-h-[102px] flex-col justify-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 text-sm">
            <div className="flex items-center justify-center gap-3">
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="radio" name="c1" className="accent-green-600" checked={skillCombatente1 === 'Luta'} onChange={() => setSkillCombatente1('Luta')} /> Luta
              </label>
              <span className="text-zinc-600">ou</span>
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="radio" name="c1" className="accent-green-600" checked={skillCombatente1 === 'Pontaria'} onChange={() => setSkillCombatente1('Pontaria')} /> Pontaria
              </label>
            </div>
            <div className="flex items-center justify-center gap-3">
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="radio" name="c2" className="accent-green-600" checked={skillCombatente2 === 'Fortitude'} onChange={() => setSkillCombatente2('Fortitude')} /> Fortitude
              </label>
              <span className="text-zinc-600">ou</span>
              <label className="flex cursor-pointer items-center gap-1.5">
                <input type="radio" name="c2" className="accent-green-600" checked={skillCombatente2 === 'Reflexos'} onChange={() => setSkillCombatente2('Reflexos')} /> Reflexos
              </label>
            </div>
          </div>

          <button
            onClick={() => escolherClasse('Combatente')}
            disabled={!combatentePronto}
            className="w-full rounded-lg bg-green-800 p-3.5 font-bold uppercase tracking-wider text-zinc-100 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            {combatentePronto ? 'Selecionar Combatente' : 'Escolha as perícias'}
          </button>
        </div>

        {/* ESPECIALISTA — Conhecimento */}
        <div className="flex flex-1 flex-col rounded-xl border border-green-900/60 bg-zinc-900/60 p-6 transition hover:border-green-700">
          <h2 className="font-display mb-3 text-center text-xl uppercase tracking-wide text-green-500">
            Especialista
          </h2>
          <p className="flex-grow text-sm leading-relaxed text-zinc-400 text-center">
            Um agente que confia mais em esperteza do que em força bruta. Um especialista se vale de conhecimento técnico, raciocínio rápido ou mesmo lábia para resolver mistérios e enfrentar o paranormal.
          </p>
          <div className="my-5 flex min-h-[102px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-sm text-zinc-500 italic">Nenhuma perícia padrão</p>
          </div>
          <button
            onClick={() => escolherClasse('Especialista')}
            className="w-full rounded-lg bg-green-800 p-3.5 font-bold uppercase tracking-wider text-zinc-100 transition hover:bg-green-700"
          >
            Selecionar Especialista
          </button>
        </div>

        {/* OCULTISTA — Medo */}
        <div className="flex flex-1 flex-col rounded-xl border border-green-900/60 bg-zinc-900/60 p-6 transition hover:border-green-700">
          <h2 className="font-display mb-3 text-center text-xl uppercase tracking-wide text-green-500">
            Ocultista
          </h2>
          <p className="flex-grow text-[13px] leading-relaxed text-zinc-400 text-center">
            O Outro Lado é misterioso, perigoso e, de certa forma, cativante. Muitos estudiosos das entidades se perdem em seus reinos obscuros em busca de poder, mas existem aqueles que visam compreender e dominar os mistérios paranormais para usá-los para combater o próprio Outro Lado. Esse tipo de agente não é apenas um conhecedor do oculto, como também possui talento para se conectar com elementos paranormais.
          </p>
          <div className="my-5 flex min-h-[102px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 text-sm">
            <div className="flex items-center justify-center gap-3">
              <span>Vontade</span>
              <span className="text-zinc-600">&</span>
              <span>Ocultismo</span>
            </div>
          </div>
          <button
            onClick={() => escolherClasse('Ocultista')}
            className="w-full rounded-lg bg-green-800 p-3.5 font-bold uppercase tracking-wider text-zinc-100 transition hover:bg-green-700"
          >
            Selecionar Ocultista
          </button>
        </div>
      </div>
    </div>
  );
};
