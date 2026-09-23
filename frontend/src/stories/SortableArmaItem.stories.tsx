import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SortableArmaItem } from '../components/SortableArmaItem';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ArmaInventario } from '../types';

const meta: Meta<typeof SortableArmaItem> = {
  title: 'Ordem Paranormal/Inventário/SortableArmaItem',
  component: SortableArmaItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SortableArmaItem>;

const DndWrapper = ({ children, itemId }: { children: React.ReactNode; itemId: string }) => (
  <DndContext>
    <SortableContext items={[itemId]} strategy={verticalListSortingStrategy}>
      <div className="w-[420px]">{children}</div>
    </SortableContext>
  </DndContext>
);

const mockRevolver: ArmaInventario = {
  id: 'arma-1',
  arma: {
    Codigo_Arma: 10,
    Nome_Item: 'Revólver .38',
    Descricao_Item: 'Arma de fogo confiável e fácil de ocultar. Usa tambor de 6 balas.',
    Categoria_Item: 'I',
    'Espaços_Item': 1,
    Tipo_Arma: 'Armas de Fogo Curtas',
    Proficiencia: 'Armas Simples',
    Dano_Arma: '2d6',
    Critico_Arma: 19,
    Multiplicador_Arma: 3,
    Alcance_Item: 'Curto',
    Tipo_Dano_Arma: 'Balístico',
    Capacidade_Municao: 6,
  },
  modificacoes: [],
  maldicoes: [],
  equipado: true,
};

const mockKatana: ArmaInventario = {
  id: 'arma-2',
  arma: {
    Codigo_Arma: 20,
    Nome_Item: 'Katana',
    Descricao_Item: 'Espada de lâmina curva tradicional japonesa, com corte letal e acabamento preciso.',
    Categoria_Item: 'II',
    'Espaços_Item': 2,
    Tipo_Arma: 'Armas Brancas de Uma Mão',
    Proficiencia: 'Armas Táticas',
    Dano_Arma: '1d10',
    Critico_Arma: 19,
    Multiplicador_Arma: 2,
    Alcance_Item: 'Corpo a Corpo',
    Tipo_Dano_Arma: 'Corte',
    'Agil?': true,
  },
  modificacoes: [],
  maldicoes: [],
  equipado: true,
};

export const Revolver: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <DndWrapper itemId={mockRevolver.id}>
        <SortableArmaItem
          item={mockRevolver}
          isExpanded={expanded}
          toggleExpandir={() => setExpanded(!expanded)}
          removerArma={() => {}}
        />
      </DndWrapper>
    );
  },
};

export const KatanaAgilExpandida: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(true);

    return (
      <DndWrapper itemId={mockKatana.id}>
        <SortableArmaItem
          item={mockKatana}
          isExpanded={expanded}
          toggleExpandir={() => setExpanded(!expanded)}
          removerArma={() => {}}
        />
      </DndWrapper>
    );
  },
};
