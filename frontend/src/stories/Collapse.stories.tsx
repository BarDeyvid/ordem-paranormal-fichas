import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Collapse } from '../components/Collapse';

const meta: Meta<typeof Collapse> = {
  title: 'Componentes/Collapse',
  component: Collapse,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const Simples: Story = {
  render: () => {
    const [aberto, setAberto] = useState(false);
    return (
      <div className="w-96 rounded border border-zinc-800 bg-zinc-900/80 p-4">
        <button
          onClick={() => setAberto(!aberto)}
          className="w-full flex justify-between items-center text-sm font-bold text-zinc-200 hover:text-green-400 transition"
        >
          <span>🔥 Habilidade: Golpe Pesado</span>
          <span className="text-xs text-zinc-500">{aberto ? '▲ Fechar' : '▼ Expandir'}</span>
        </button>

        <Collapse isOpen={aberto} className="mt-3">
          <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 leading-relaxed">
            Ao fazer um ataque corpo a corpo, você pode gastar 2 PE para desferir um golpe avassalador.
            Se acertar, soma mais um dado do mesmo tipo ao dano da sua arma.
          </div>
        </Collapse>
      </div>
    );
  },
};

export const ComPreviewHeight: Story = {
  render: () => {
    const [expandido, setExpandido] = useState(false);
    return (
      <div className="w-96 rounded border border-zinc-800 bg-zinc-900/80 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-red-400">🩸 Ritual: Descarnar</span>
          <span className="text-xs px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-900/60 font-mono">
            2º Círculo
          </span>
        </div>

        <Collapse isOpen={expandido} previewHeight="4.5em">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Fios escarlates de energia brotam das suas pontas dos dedos e penetram na pele do alvo,
            rasgando a carne viva sob o comando de sua vontade sombria. O alvo sofre 6d8 pontos de dano
            de Sangue e fica Sangrando. Se passar no teste de Fortitude, sofre metade do dano e não sangra.
            Discente (+3 PE): Aumenta o dano para 10d8 e o alvo fica vulnerável até o final da cena.
          </p>
        </Collapse>

        <button
          onClick={() => setExpandido(!expandido)}
          className="mt-2 text-xs text-green-400 hover:underline font-bold"
        >
          {expandido ? 'Ver menos ▲' : 'Ver descrição completa ▼'}
        </button>
      </div>
    );
  },
};
