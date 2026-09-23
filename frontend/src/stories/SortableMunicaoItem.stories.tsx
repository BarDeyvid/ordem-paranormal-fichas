import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SortableMunicaoItem } from '../components/SortableMunicaoItem';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { MunicaoInventario } from '../types';

const meta: Meta<typeof SortableMunicaoItem> = {
  title: 'Ordem Paranormal/Inventário/SortableMunicaoItem',
  component: SortableMunicaoItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SortableMunicaoItem>;

const DndWrapper = ({ children, itemId }: { children: React.ReactNode; itemId: string }) => (
  <DndContext>
    <SortableContext items={[itemId]} strategy={verticalListSortingStrategy}>
      <div className="w-[420px]">{children}</div>
    </SortableContext>
  </DndContext>
);

const mockMunicaoBalasCurtas: MunicaoInventario = {
  id: 'mun-1',
  municao: {
    Codigo_Item: 50,
    Nome_Item: 'Balas Curtas (Pacote)',
    Descricao_Item: 'Munição padrão para pistolas e revólveres. Um pacote contém munição suficiente para uma missão inteira.',
    Categoria_Item: 'I',
    'Espaços_Item': 1,
    contagem_municao: 30,
  },
  modificacoes: [],
  maldicoes: [],
  qtd: 1,
};

const mockMunicaoBalasLongas: MunicaoInventario = {
  id: 'mun-2',
  municao: {
    Codigo_Item: 51,
    Nome_Item: 'Balas Longas (Pacote)',
    Descricao_Item: 'Munição de alto calibre para fuzis de assalto e fuzis de precisão.',
    Categoria_Item: 'I',
    'Espaços_Item': 1,
    contagem_municao: 20,
  },
  modificacoes: [],
  maldicoes: [],
  qtd: 2,
};

export const Padrao: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <DndWrapper itemId={mockMunicaoBalasCurtas.id}>
        <SortableMunicaoItem
          id={mockMunicaoBalasCurtas.id}
          item={mockMunicaoBalasCurtas}
          isExpanded={expanded}
          toggleExpandir={() => setExpanded(!expanded)}
          removerItem={() => {}}
        />
      </DndWrapper>
    );
  },
};

export const Expandida: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(true);

    return (
      <DndWrapper itemId={mockMunicaoBalasLongas.id}>
        <SortableMunicaoItem
          id={mockMunicaoBalasLongas.id}
          item={mockMunicaoBalasLongas}
          isExpanded={expanded}
          toggleExpandir={() => setExpanded(!expanded)}
          removerItem={() => {}}
        />
      </DndWrapper>
    );
  },
};
