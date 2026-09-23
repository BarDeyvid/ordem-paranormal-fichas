import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { InputOtimizado } from '../components/InputOtimizado';

const meta: Meta<typeof InputOtimizado> = {
  title: 'Componentes/InputOtimizado',
  component: InputOtimizado,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InputOtimizado>;

export const Padrao: Story = {
  render: () => {
    const [busca, setBusca] = useState('');
    return (
      <div className="w-80 flex flex-col gap-2">
        <label className="text-xs uppercase font-bold text-zinc-400">
          Pesquisar Item (com Debounce de 300ms)
        </label>
        <InputOtimizado
          value={busca}
          onChange={setBusca}
          placeholder="Ex: Espada, Pistola, Cicatrização..."
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-green-600 outline-none transition"
        />
        <span className="text-xs text-zinc-500">
          Valor final sincronizado: <code className="text-green-400">{busca || '(vazio)'}</code>
        </span>
      </div>
    );
  },
};
