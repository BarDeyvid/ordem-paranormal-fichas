import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SortableItemGeral, type SortableItemGeralProps } from '../components/SortableItemGeral';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ItemGeralInventario } from '../types';

const meta: Meta<typeof SortableItemGeral> = {
  title: 'Ordem Paranormal/Inventário/SortableItemGeral',
  component: SortableItemGeral,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SortableItemGeral>;

const DndWrapper = ({ children, itemId }: { children: React.ReactNode; itemId: string }) => (
  <DndContext>
    <SortableContext items={[itemId]} strategy={verticalListSortingStrategy}>
      <div className="w-[420px]">{children}</div>
    </SortableContext>
  </DndContext>
);

const mockItem: ItemGeralInventario = {
  id: 'item-1',
  item: {
    Codigo_Item: 10,
    Nome_Item: 'Vestimenta Reforçada',
    Desc_Item: 'Uma vestimenta com proteção balística leve ou placas de cerâmica embutidas. Concede +2 em Defesa.',
    Categoria_Item: 'I',
    Espacos_Itens: 1,
    Grupo_Item: 'Vestimenta',
    Fonte_Item: 'Livro Básico p. 64',
  },
  modificacoes: [],
  maldicoes: [],
  equipado: true,
};

const mockItemExplosivo: ItemGeralInventario = {
  id: 'item-2',
  item: {
    Codigo_Item: 25,
    Nome_Item: 'Granada de Fragmentação',
    Desc_Item: 'Explosivo antipessoal. Ao detonar, causa 4d6 de dano de Perfuração e Impacto em uma área de 6m.',
    Categoria_Item: 'I',
    Espacos_Itens: 1,
    Grupo_Item: 'Explosivos',
    Fonte_Item: 'Livro Básico p. 67',
  },
  modificacoes: [],
  maldicoes: [],
};

export const Padrao: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);
    const [equipado, setEquipado] = useState(true);

    return (
      <DndWrapper itemId={mockItem.id}>
        <SortableItemGeral
          item={{ ...mockItem, equipado }}
          isExpanded={expanded}
          toggleExpandir={() => setExpanded(!expanded)}
          removerItem={() => {}}
          toggleEquipado={() => setEquipado(!equipado)}
        />
      </DndWrapper>
    );
  },
};

export const Expandido: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(true);

    return (
      <DndWrapper itemId={mockItem.id}>
        <SortableItemGeral
          item={mockItem}
          isExpanded={expanded}
          toggleExpandir={() => setExpanded(!expanded)}
          removerItem={() => {}}
          toggleEquipado={() => {}}
        />
      </DndWrapper>
    );
  },
};

export const ExplosivoComDT: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <DndWrapper itemId={mockItemExplosivo.id}>
        <SortableItemGeral
          item={mockItemExplosivo}
          isExpanded={expanded}
          toggleExpandir={() => setExpanded(!expanded)}
          removerItem={() => {}}
          toggleEquipado={() => {}}
          stringDT="AGI 15"
        />
      </DndWrapper>
    );
  },
};
