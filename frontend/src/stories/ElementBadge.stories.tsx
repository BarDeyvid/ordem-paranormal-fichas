import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ElementBadge } from '../components/ElementBadge';

const meta: Meta<typeof ElementBadge> = {
  title: 'Componentes/ElementBadge',
  component: ElementBadge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ElementBadge>;

export const BadgesGrandesEFiltros: Story = {
  render: () => {
    const [sel, setSel] = useState('Sangue');
    const elementos = ['Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo'];
    return (
      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase font-bold text-zinc-400">
          Padrão 1: Botões de Filtro e Badges de Círculo
        </span>
        <div className="flex flex-wrap gap-2">
          {elementos.map((e) => (
            <ElementBadge
              key={e}
              elemento={e}
              variant="badge"
              selecionado={sel === e}
              onClick={() => setSel(e)}
            />
          ))}
        </div>
        <span className="text-xs text-zinc-500">
          Elemento selecionado: <strong className="text-zinc-200">{sel}</strong>
        </span>
      </div>
    );
  },
};

export const TagsPequenasInline: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase font-bold text-zinc-400">
          Padrão 2: Tags Inline (sem borda) ao lado de nomes de itens e poderes
        </span>
        <div className="bg-zinc-900/60 p-4 rounded border border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-zinc-200">
            <span>Espada Vorpal</span>
            <ElementBadge elemento="Sangue" variant="inline" />
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-200">
            <span>Faixa da Vidência</span>
            <ElementBadge elemento="Conhecimento" variant="inline" />
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-200">
            <span>Pistola Voltaica</span>
            <ElementBadge elemento="Energia" variant="inline" />
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-200">
            <span>Cinzas da Morte</span>
            <ElementBadge elemento="Morte" variant="inline" />
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-200">
            <span>Símbolo Arcano</span>
            <ElementBadge elemento="Medo" variant="inline" />
          </div>
        </div>
      </div>
    );
  },
};
