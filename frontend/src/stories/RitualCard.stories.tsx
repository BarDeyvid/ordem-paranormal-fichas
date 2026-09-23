import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { RitualCard, type RitualCardProps } from '../components/RitualCard';
import type { VersaoRitual } from '../types';

const meta: Meta<typeof RitualCard> = {
  title: 'Ficha/RitualCard',
  component: RitualCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RitualCard>;

const ritualCicatrizacao = {
  Codigo_Ritual: 1,
  Nome_Ritual: 'Cicatrização',
  Elemento_Ritual: 'Sangue',
  Circulo_Ritual: '1° Círculo',
  Execucao_Ritual: 'Padrão',
  Alcance_Ritual: 'Toque',
  Alvo_Ritual: '1 ser',
  Duracao_Ritual: 'Instantânea',
  Resistencia_Ritual: 'Nenhuma',
  PE_Ritual: '1/3/6',
  Dados_Ritual: '3d8+3 / 5d8+5',
  Tem_Discente: true,
  Tem_Verdadeiro: true,
  Requisito_Discente: '2° Círculo',
  Requisito_Verdadeiro: '3° Círculo, Afinidade',
  Descricao_Ritual: 'Você canaliza energia regenerativa de Sangue sobre o alvo.\nO alvo recupera 3d8+3 pontos de vida, mas envelhece 1 ano.\n*Discente (+2 PE):* Aumenta a cura para 5d8+5 PV.\n*Verdadeiro (+5 PE):* Cura 7d8+7 PV e pode curar ferimentos graves.',
  Origem: 'ocultista_1',
};

const ritualEletrocussao = {
  Codigo_Ritual: 14,
  Nome_Ritual: 'Eletrocussão',
  Elemento_Ritual: 'Energia',
  Circulo_Ritual: '1° Círculo',
  Execucao_Ritual: 'Padrão',
  Alcance_Ritual: 'Curto',
  Alvo_Ritual: '1 ser ou objeto',
  Duracao_Ritual: 'Instantânea',
  Resistencia_Ritual: 'Fortitude reduz à metade',
  PE_Ritual: '1/2/5',
  Dados_Ritual: '3d6 / 6d6 / 10d6',
  Tem_Discente: true,
  Tem_Verdadeiro: true,
  Requisito_Discente: '2° Círculo',
  Requisito_Verdadeiro: '3° Círculo',
  Descricao_Ritual: 'Correntes elétricas roxas saltam dos seus dedos em direção ao alvo.\nCausa 3d6 pontos de dano de Energia e deixa o alvo vulnerável.\n*Discente (+1 PE):* Muda o dano para 6d6 de Energia.\n*Verdadeiro (+4 PE):* Muda o dano para 10d6 de Energia e atinge até 3 alvos adjacentes.',
  Origem: 'aprender_ritual_1',
};

const ritualDecadencia = {
  Codigo_Ritual: 8,
  Nome_Ritual: 'Decadência',
  Elemento_Ritual: 'Morte',
  Circulo_Ritual: '1° Círculo',
  Execucao_Ritual: 'Padrão',
  Alcance_Ritual: 'Toque',
  Alvo_Ritual: '1 ser',
  Duracao_Ritual: 'Instantânea',
  Resistencia_Ritual: 'Fortitude reduz à metade',
  PE_Ritual: '1/3',
  Dados_Ritual: '2d8+2 / 4d8+4',
  Tem_Discente: true,
  Tem_Verdadeiro: false,
  Requisito_Discente: '2° Círculo',
  Descricao_Ritual: 'Você acelera a passagem do tempo na matéria orgânica do alvo, apodrecendo sua carne.\nO alvo sofre 2d8+2 pontos de dano de Morte.\n*Discente (+2 PE):* Aumenta o dano para 4d8+4 pontos de dano de Morte.',
  Origem: 'ocultista_2',
};

const InteractiveRitual = (args: RitualCardProps) => {
  const [expandido, setExpandido] = useState(args.expandido);
  const [versao, setVersao] = useState<VersaoRitual>(args.versao || 'normal');

  return (
    <div className="max-w-xl mx-auto bg-zinc-950 p-4 rounded-xl border border-zinc-800">
      <RitualCard
        {...args}
        expandido={expandido}
        onToggleExpandir={() => setExpandido(prev => !prev)}
        versao={versao}
        onMudarVersao={setVersao}
        onProjetarMesa={(nome, elem, alcance, pe) => {
          alert(`Projetado na mesa: ${nome} (${elem}) - Alcance: ${alcance} - Custo: ${pe} PE`);
        }}
        onEditar={() => alert('Abrir modal de edição do ritual')}
        onEsquecer={() => alert('Esquecer ritual solicitado')}
      />
    </div>
  );
};

export const CicatrizacaoPadrao: Story = {
  render: (args) => <InteractiveRitual {...args} />,
  args: {
    ritual: ritualCicatrizacao,
    expandido: false,
    versao: 'normal',
    nivel: 5,
    classe: 'Ocultista',
    afinidadeAtiva: false,
  },
};

export const CicatrizacaoExpandido: Story = {
  render: (args) => <InteractiveRitual {...args} />,
  args: {
    ritual: ritualCicatrizacao,
    expandido: true,
    versao: 'normal',
    nivel: 5,
    classe: 'Ocultista',
    afinidadeAtiva: false,
  },
};

export const CicatrizacaoDiscente: Story = {
  render: (args) => <InteractiveRitual {...args} />,
  args: {
    ritual: ritualCicatrizacao,
    expandido: true,
    versao: 'discente',
    nivel: 5,
    classe: 'Ocultista',
    afinidadeAtiva: false,
  },
};

export const EletrocussaoEnergia: Story = {
  render: (args) => <InteractiveRitual {...args} />,
  args: {
    ritual: ritualEletrocussao,
    expandido: true,
    versao: 'normal',
    nivel: 3,
    classe: 'Ocultista',
  },
};

export const DecadenciaMorte: Story = {
  render: (args) => <InteractiveRitual {...args} />,
  args: {
    ritual: ritualDecadencia,
    expandido: false,
    versao: 'normal',
    nivel: 1,
    classe: 'Combatente',
  },
};
