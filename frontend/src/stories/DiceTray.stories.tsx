import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useEffect } from 'react';
import { DiceTray } from '../components/DiceRoller/DiceTray';
import { DieBadge } from '../components/DiceRoller/DieBadge';
import { useRPG } from '../context/RPGContext';

const meta: Meta<typeof DiceTray> = {
  title: 'Ordem Paranormal/Dados/DiceTray',
  component: DiceTray,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof DiceTray>;

export const Padrao: Story = {
  render: () => {
    return (
      <div className="relative min-h-[480px] p-6 flex flex-col justify-between">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
          <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-1">
            Bandeja de Rolagem de Dados
          </h2>
          <p className="text-xs text-zinc-400">
            Clique no botão flutuante 🎲 no canto inferior direito para abrir a bandeja, ou use as ações abaixo.
          </p>
        </div>

        <DiceTrayDemoButtons />
        <DiceTray />
      </div>
    );
  },
};

export const ComRolagemCritica: Story = {
  render: () => {
    return (
      <div className="relative min-h-[480px] p-6 flex flex-col justify-between">
        <AutoRollCritical />
        <DiceTray />
      </div>
    );
  },
};

function DiceTrayDemoButtons() {
  const { executarRolagemPericia, executarRolagemAtaque, executarRolagemDano, setDiceTrayAberto } = useRPG();

  return (
    <div className="flex flex-wrap gap-2 my-auto justify-center">
      <button
        type="button"
        onClick={() => {
          executarRolagemPericia('Ocultismo', 'INT', 10);
        }}
        className="px-3 py-2 rounded bg-zinc-800 hover:bg-emerald-950/80 border border-zinc-700 hover:border-emerald-600 text-xs font-bold text-zinc-200 hover:text-emerald-400 transition"
      >
        🔮 Teste: Ocultismo (INT+10)
      </button>

      <button
        type="button"
        onClick={() => {
          executarRolagemAtaque('Fuzil de Assalto', 'AGI', 5, 19, 'Pontaria');
        }}
        className="px-3 py-2 rounded bg-zinc-800 hover:bg-emerald-950/80 border border-zinc-700 hover:border-emerald-600 text-xs font-bold text-zinc-200 hover:text-emerald-400 transition"
      >
        ⚔️ Ataque: Fuzil (AGI+5, 19/x3)
      </button>

      <button
        type="button"
        onClick={() => {
          executarRolagemDano('Fuzil de Assalto', '2d10+4', 3, false);
        }}
        className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold text-zinc-200 transition"
      >
        💥 Dano Normal: 2d10+4
      </button>

      <button
        type="button"
        onClick={() => {
          executarRolagemDano('Fuzil de Assalto', '2d10+4', 3, true);
        }}
        className="px-3 py-2 rounded bg-zinc-800 hover:bg-red-950/80 border border-zinc-700 hover:border-red-600 text-xs font-bold text-zinc-200 hover:text-red-400 transition"
      >
        🔥 Dano Crítico: 6d10+4 (x3)
      </button>

      <button
        type="button"
        onClick={() => setDiceTrayAberto(true)}
        className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition"
      >
        🎲 Abrir Bandeja
      </button>
    </div>
  );
}

function AutoRollCritical() {
  const { executarRolagemPericia } = useRPG();

  useEffect(() => {
    executarRolagemPericia('Percepção', 'PRE', 5);
  }, [executarRolagemPericia]);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
      <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-1">
        Demonstração Automática de Rolagem
      </h2>
      <p className="text-xs text-zinc-400">
        Um teste de Percepção foi executado e o painel foi aberto automaticamente com os resultados.
      </p>
    </div>
  );
}

export const BadgesIndividuais: Story = {
  render: () => {
    return (
      <div className="p-6 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Estados dos Badges de Dados
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-col items-center gap-1">
            <DieBadge dado={{ faces: 20, valor: 20, mantido: true, critico: true, desastre: false }} tamanho="lg" />
            <span className="text-[10px] text-emerald-400 font-bold">Crítico</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <DieBadge dado={{ faces: 20, valor: 1, mantido: true, critico: false, desastre: true }} tamanho="lg" />
            <span className="text-[10px] text-red-400 font-bold">Desastre</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <DieBadge dado={{ faces: 20, valor: 16, mantido: true, critico: false, desastre: false }} tamanho="lg" />
            <span className="text-[10px] text-zinc-300 font-bold">Mantido</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <DieBadge dado={{ faces: 20, valor: 7, mantido: false, critico: false, desastre: false }} tamanho="lg" />
            <span className="text-[10px] text-zinc-500 line-through">Descartado</span>
          </div>
        </div>
      </div>
    );
  },
};
