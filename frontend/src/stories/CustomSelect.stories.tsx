import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { CustomSelect } from '../components/CustomSelect';

const meta: Meta<typeof CustomSelect> = {
  title: 'Componentes/CustomSelect',
  component: CustomSelect,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    hideIcon: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CustomSelect>;

export const Padrao: Story = {
  render: () => {
    const [val, setVal] = useState('Combatente');
    return (
      <div className="w-72">
        <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5">
          Classe do Personagem
        </label>
        <CustomSelect
          value={val}
          onChange={setVal}
          options={[
            { value: 'Combatente', label: '⚔️ Combatente' },
            { value: 'Especialista', label: '🎯 Especialista' },
            { value: 'Ocultista', label: '🔮 Ocultista' },
          ]}
        />
      </div>
    );
  },
};

export const ComSubtitulos: Story = {
  render: () => {
    const [val, setVal] = useState('guerreiro');
    return (
      <div className="w-80">
        <label className="block text-xs uppercase font-bold text-zinc-400 mb-1.5">
          Trilha de Classe
        </label>
        <CustomSelect
          value={val}
          onChange={setVal}
          options={[
            { value: 'aniquilador', label: 'Aniquilador', subtitle: 'Especialista em armas letais' },
            { value: 'guerreiro', label: 'Guerreiro', subtitle: 'Mestre do combate corpo a corpo' },
            { value: 'comandante', label: 'Comandante de Campo', subtitle: 'Líder tático do esquadrão' },
            { value: 'bloqueado', label: 'Trilha Secreta', disabled: true, subtitle: 'Requer NEX 40%' },
          ]}
        />
      </div>
    );
  },
};

export const CompactoParaTabela: Story = {
  render: () => {
    const [val, setVal] = useState('5');
    return (
      <div className="w-32 bg-zinc-900/60 p-3 rounded border border-zinc-800">
        <span className="block text-xs font-bold text-zinc-400 mb-1 text-center">Treino</span>
        <CustomSelect
          value={val}
          onChange={setVal}
          hideIcon={true}
          className="text-center font-bold !text-emerald-400"
          options={[
            { value: '0', label: '+0' },
            { value: '5', label: '+5' },
            { value: '10', label: '+10' },
            { value: '15', label: '+15' },
          ]}
        />
      </div>
    );
  },
};
