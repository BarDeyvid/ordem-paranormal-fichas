import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PoderCard, SlotPoderVazioCard, type PoderItem } from '../components/PoderCard';

const meta: Meta<typeof PoderCard> = {
  title: 'Ficha/PoderCard',
  component: PoderCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PoderCard>;

const poderAtaqueEspecial: PoderItem = {
  id: 'poder_classe_1',
  nome: 'Ataque Especial',
  tipo: 'Classe',
  categoria: 'classe',
  descricao: 'Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avança de nível, você pode gastar mais PE para receber bônus maiores.',
  automatico: 'Sim',
  fonte: 'Combatente (NEX 10%)',
};

const poderSangueDeFerro: PoderItem = {
  id: 'poder_paranormal_1',
  nome: 'Sangue de Ferro',
  tipo: 'Paranormal',
  categoria: 'paranormais',
  elemento: 'Sangue',
  descricao: 'Seu sangue se torna mais espesso e resistente. Você recebe +2 pontos de vida por nível de exposição (NEX).',
  afinidade: 'Você recebe +2 PV adicionais por NEX (total +4 PV por NEX) e resistência a Sangue 5.',
  afinidadeAtiva: false,
  automatico: 'Sim',
  fonte: 'Poder Paranormal',
  preRequisitos: 'Sangue 1',
};

const poderSangueDeFerroComAfinidade: PoderItem = {
  ...poderSangueDeFerro,
  afinidadeAtiva: true,
  afinidadeAdquiridaKey: 50,
};

const poderAprenderRitual: PoderItem = {
  id: 'poder_aprender_ritual',
  nome: 'Aprender Ritual (Cicatrização)',
  tipo: 'Paranormal',
  categoria: 'paranormais',
  elemento: 'Sangue',
  descricao: 'Você aprende um ritual de 1° Círculo à sua escolha.',
  automatico: 'Sim',
  fonte: 'Poder Paranormal',
  limiteCirculos: {
    c1: 1,
    c2: 0,
    c3: 0,
    c4: 0,
  },
};

const InteractivePoder = ({ poder, estaExpandida: initExpandida = false }: { poder: PoderItem; estaExpandida?: boolean }) => {
  const [expandida, setExpandida] = useState(initExpandida);

  return (
    <div className="max-w-xl mx-auto bg-zinc-950 p-4 rounded-xl border border-zinc-800">
      <PoderCard
        poder={poder}
        estaExpandida={expandida}
        toggleExpandir={() => setExpandida(prev => !prev)}
        onEditar={() => alert('Editar poder clicado')}
        onRemover={() => alert('Remover poder clicado')}
        onRemoverAfinidade={() => alert('Remover afinidade clicado')}
      />
    </div>
  );
};

export const PoderClasse: Story = {
  render: () => <InteractivePoder poder={poderAtaqueEspecial} estaExpandida={false} />,
};

export const PoderClasseExpandido: Story = {
  render: () => <InteractivePoder poder={poderAtaqueEspecial} estaExpandida={true} />,
};

export const PoderParanormalSangue: Story = {
  render: () => <InteractivePoder poder={poderSangueDeFerro} estaExpandida={true} />,
};

export const PoderComAfinidadeAtiva: Story = {
  render: () => <InteractivePoder poder={poderSangueDeFerroComAfinidade} estaExpandida={true} />,
};

export const PoderAprenderRitualComCirculos: Story = {
  render: () => <InteractivePoder poder={poderAprenderRitual} estaExpandida={true} />,
};

export const SlotVazio: StoryObj<typeof SlotPoderVazioCard> = {
  render: () => (
    <div className="max-w-xl mx-auto bg-zinc-950 p-4 rounded-xl border border-zinc-800">
      <SlotPoderVazioCard
        nome="Poder de Combatente"
        tipo="NEX 15%"
        descricao="Clique para escolher um poder de combatente da lista disponível para o seu nível."
        onClick={() => alert('Modal de seleção aberto')}
      />
    </div>
  ),
};
