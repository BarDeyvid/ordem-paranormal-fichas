import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FichaA4Page1 } from '../components/PrintA4/FichaA4Page1';
import { FichaA4Page2 } from '../components/PrintA4/FichaA4Page2';
import { ModalPrintPreview } from '../components/PrintA4/ModalPrintPreview';

const meta: Meta = {
  title: 'Ordem Paranormal/Impressao/FichaA4',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const Pagina1Frente: StoryObj = {
  render: () => (
    <div className="flex justify-center p-4 bg-zinc-900 rounded-xl overflow-x-auto">
      <div className="shadow-2xl ring-1 ring-zinc-700/60 rounded overflow-hidden">
        <FichaA4Page1 />
      </div>
    </div>
  ),
};

export const Pagina2Verso: StoryObj = {
  render: () => (
    <div className="flex justify-center p-4 bg-zinc-900 rounded-xl overflow-x-auto">
      <div className="shadow-2xl ring-1 ring-zinc-700/60 rounded overflow-hidden">
        <FichaA4Page2 />
      </div>
    </div>
  ),
};

export const ModalVisualizacaoImpressao: StoryObj = {
  render: () => {
    const [aberto, setAberto] = useState(true);

    return (
      <div className="flex flex-col items-center justify-center p-12">
        <button
          type="button"
          onClick={() => setAberto(true)}
          className="rounded bg-emerald-600 px-4 py-2 font-bold text-white shadow hover:bg-emerald-500 uppercase tracking-wider text-xs"
        >
          Abrir Pré-visualização A4
        </button>

        <ModalPrintPreview
          isOpen={aberto}
          onClose={() => setAberto(false)}
        />
      </div>
    );
  },
};
