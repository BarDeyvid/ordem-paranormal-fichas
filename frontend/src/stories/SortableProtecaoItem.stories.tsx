import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SortableProtecaoItem } from '../components/SortableProtecaoItem';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ProtecaoInventario } from '../types';

const meta: Meta<typeof SortableProtecaoItem> = {
  title: 'Ordem Paranormal/Inventário/SortableProtecaoItem',
  component: SortableProtecaoItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SortableProtecaoItem>;

const DndWrapper = ({ children, itemId }: { children: React.ReactNode; itemId: string }) => (
  <DndContext>
    <SortableContext items={[itemId]} strategy={verticalListSortingStrategy}>
      <div className="w-[420px]">{children}</div>
    </SortableContext>
  </DndContext>
);

const mockProtecaoLeve: ProtecaoInventario = {
  id: 'prot-1',
  protecao: {
    Codigo_Protecao: 1,
    Nome_Protecao: 'Proteção Leve',
    Defesa_Protecao: '+5',
    Espacos_Protecao: 2,
    Categoria_Protecao: 'I',
    Proficiencia: 'Proteções Leves',
    Descricao_Protecao: 'Colete de Kevlar ou armadura de couro grosso com reforços de metal. Fornece boa proteção sem comprometer a mobilidade.',
  },
  modificacoes: [],
  maldicoes: [],
  equipado: true,
};

const mockProtecaoPesada: ProtecaoInventario = {
  id: 'prot-2',
  protecao: {
    Codigo_Protecao: 2,
    Nome_Protecao: 'Proteção Pesada',
    Defesa_Protecao: '+10',
    Espacos_Protecao: 5,
    Categoria_Protecao: 'II',
    Proficiencia: 'Proteções Pesadas',
    Descricao_Protecao: 'Colete balístico com placas de titânio ou armadura antimotim completa. Muito pesada e impõe desvantagem para quem não for treinado.',
  },
  modificacoes: [],
  maldicoes: [],
  equipado: false,
};

export const Equipada: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);
    const [equipado, setEquipado] = useState(true);

    return (
      <DndWrapper itemId={mockProtecaoLeve.id}>
        <SortableProtecaoItem
          item={{ ...mockProtecaoLeve, equipado }}
          isExpanded={expanded}
          toggleExpandir={() => setExpanded(!expanded)}
          removerProtecao={() => {}}
          toggleEquipado={() => setEquipado(!equipado)}
        />
      </DndWrapper>
    );
  },
};

export const Expandida: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(true);

    return (
      <DndWrapper itemId={mockProtecaoPesada.id}>
        <SortableProtecaoItem
          item={mockProtecaoPesada}
          isExpanded={expanded}
          toggleExpandir={() => setExpanded(!expanded)}
          removerProtecao={() => {}}
          toggleEquipado={() => {}}
        />
      </DndWrapper>
    );
  },
};
