import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useEffect } from 'react';
import { ModalCondicoes } from '../components/ModalCondicoes';
import { useRPG } from '../context/RPGContext';

const meta: Meta<typeof ModalCondicoes> = {
  title: 'Ordem Paranormal/Condições/ModalCondicoes',
  component: ModalCondicoes,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ModalCondicoes>;

export const Padrao: Story = {
  render: () => {
    return (
      <div className="relative min-h-[480px] p-6 flex flex-col items-center justify-center">
        <OpenModalButton />
        <ModalCondicoes />
      </div>
    );
  },
};

export const ComCondicoesPreviamenteAtivas: Story = {
  render: () => {
    return (
      <div className="relative min-h-[480px] p-6 flex flex-col items-center justify-center">
        <WithActiveConditions />
        <ModalCondicoes />
      </div>
    );
  },
};

function OpenModalButton() {
  const { modalCondicoesAberto, setModalCondicoesAberto, condicoesAtivas } = useRPG();

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-zinc-400">
        Condições ativas no momento: <strong className="text-emerald-400">{condicoesAtivas.length}</strong>
      </p>
      <button
        type="button"
        onClick={() => setModalCondicoesAberto(true)}
        className="rounded bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition"
      >
        🩸 Abrir Catálogo de Condições
      </button>
    </div>
  );
}

function WithActiveConditions() {
  const { setModalCondicoesAberto, setCondicoesAtivas } = useRPG();

  useEffect(() => {
    setCondicoesAtivas(['vulneravel', 'lento', 'sangrando']);
    setModalCondicoesAberto(true);
  }, [setCondicoesAtivas, setModalCondicoesAberto]);

  return (
    <div className="text-center text-xs text-zinc-400">
      O modal foi aberto com Vulnerável, Lento e Sangrando ativos para demonstração.
    </div>
  );
}
