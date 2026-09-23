import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArmaCombateCard } from '../components/ArmaCombateCard';
import type { ArmaInventario } from '../types';

const meta: Meta<typeof ArmaCombateCard> = {
  title: 'Ordem Paranormal/Combate/ArmaCombateCard',
  component: ArmaCombateCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ArmaCombateCard>;

const mockFuzilAssalto: ArmaInventario = {
  id: 'arma-fuzil',
  arma: {
    Codigo_Arma: 35,
    Nome_Item: 'Fuzil de Assalto',
    Descricao_Item: 'Arma militar automática de alta cadência e precisão.',
    Categoria_Item: 'II',
    'Espaços_Item': 2,
    Tipo_Arma: 'Armas de Fogo Longas',
    Proficiencia: 'Armas Táticas',
    Dano_Arma: '2d10',
    Critico_Arma: 19,
    Multiplicador_Arma: 3,
    Alcance_Item: 'Médio',
    Tipo_Dano_Arma: 'Balístico',
    Capacidade_Municao: 30,
    'Automatica?': true,
  },
  modificacoes: [],
  maldicoes: [],
  equipado: true,
};

const mockEspadaCruel: ArmaInventario = {
  id: 'arma-espada',
  arma: {
    Codigo_Arma: 40,
    Nome_Item: 'Espada Longa',
    Descricao_Item: 'Lâmina reta tradicional de combate corpo a corpo.',
    Categoria_Item: 'I',
    'Espaços_Item': 1,
    Tipo_Arma: 'Armas Brancas de Uma Mão',
    Proficiencia: 'Armas Simples',
    Dano_Arma: '1d8/1d10',
    Critico_Arma: 19,
    Multiplicador_Arma: 2,
    Alcance_Item: 'Corpo a Corpo',
    Tipo_Dano_Arma: 'Corte',
  },
  modificacoes: [],
  maldicoes: [],
  equipado: true,
};

export const FuzilAutomatico: Story = {
  render: () => {
    const [expandido, setExpandido] = useState(false);

    return (
      <div className="w-[420px]">
        <ArmaCombateCard
          armaInv={mockFuzilAssalto}
          estaExpandida={expandido}
          toggleExpandir={() => setExpandido(!expandido)}
          modificacoesHook={{ modificacoes: [] }}
          maldicoesHook={{ maldicoes: [] }}
        />
      </div>
    );
  },
};

export const EspadaLongaExpandida: Story = {
  render: () => {
    const [expandido, setExpandido] = useState(true);

    return (
      <div className="w-[420px]">
        <ArmaCombateCard
          armaInv={mockEspadaCruel}
          estaExpandida={expandido}
          toggleExpandir={() => setExpandido(!expandido)}
          modificacoesHook={{ modificacoes: [] }}
          maldicoesHook={{ maldicoes: [] }}
        />
      </div>
    );
  },
};
