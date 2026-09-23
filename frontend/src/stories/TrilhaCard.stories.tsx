import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TrilhaCard, type TrilhaData } from '../components/TrilhaCard';

const meta: Meta<typeof TrilhaCard> = {
  title: 'Ficha/TrilhaCard',
  component: TrilhaCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TrilhaCard>;

const trilhaAniquilador: TrilhaData = {
  Codigo_Trilha: 1,
  Nome_Trilha: 'Aniquilador',
  Descricao_Trilha: 'Você dedica sua vida ao domínio absoluto de uma única arma, transformando-a em uma extensão letal do seu corpo.',
  Fonte_Trilha: 'Livro Básico',
  nome_pericia: 'Luta ou Pontaria',
  Nome_Habilidade_10: 'A Favorita',
  Descricao_Habilidade_10: 'Escolha uma arma para ser a sua favorita. A categoria desta arma é reduzida em I.',
  Nome_Habilidade_40: 'Técnica Letal',
  Descricao_Habilidade_40: 'A margem de ameaça da sua arma favorita aumenta em +1, e você pode gastar 2 PE para aumentar o multiplicador de crítico em +1.',
  Nome_Habilidade_65: 'Golpe Demolidor',
  Descricao_Habilidade_65: 'Quando acerta um golpe crítico com sua arma favorita, você pode gastar 2 PE adicionais para causar dano máximo.',
  Nome_Habilidade_99: 'Máquina de Matar',
  Descricao_Habilidade_99: 'O multiplicador de crítico da sua arma favorita aumenta em +1 adicional.',
};

const InteractiveTrilha = ({
  trilha,
  effectiveNex = 40,
  estaExpandida: initExpandida = true,
  isVersatilidade = false,
}: {
  trilha: TrilhaData;
  effectiveNex?: number;
  estaExpandida?: boolean;
  isVersatilidade?: boolean;
}) => {
  const [expandida, setExpandida] = useState(initExpandida);
  const [habsExpandidas, setHabsExpandidas] = useState<string[]>([
    `trilha_${isVersatilidade ? 'versatilidade_' : ''}${trilha.Codigo_Trilha}_hab_10`,
  ]);

  const toggleHab = (id: string) => {
    setHabsExpandidas(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  return (
    <div className="max-w-xl mx-auto bg-zinc-950 p-4 rounded-xl border border-zinc-800">
      <TrilhaCard
        trilha={trilha}
        isVersatilidade={isVersatilidade}
        effectiveNex={effectiveNex}
        estaExpandida={expandida}
        toggleExpandir={() => setExpandida(prev => !prev)}
        habilidadesExpandidas={habsExpandidas}
        toggleHabilidadeExpandida={toggleHab}
        onEditar={() => alert('Editar trilha clicado')}
        onRemover={() => alert('Remover trilha clicado')}
      />
    </div>
  );
};

export const AniquiladorNEX40: Story = {
  render: () => <InteractiveTrilha trilha={trilhaAniquilador} effectiveNex={40} estaExpandida={true} />,
};

export const AniquiladorRecolhido: Story = {
  render: () => <InteractiveTrilha trilha={trilhaAniquilador} effectiveNex={40} estaExpandida={false} />,
};

export const AniquiladorNEX99Completo: Story = {
  render: () => <InteractiveTrilha trilha={trilhaAniquilador} effectiveNex={99} estaExpandida={true} />,
};
