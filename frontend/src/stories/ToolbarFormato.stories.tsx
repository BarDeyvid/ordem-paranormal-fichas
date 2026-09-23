import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef } from 'react';
import { ToolbarFormato } from '../components/ToolbarFormato';

const meta: Meta<typeof ToolbarFormato> = {
  title: 'Componentes/ToolbarFormato',
  component: ToolbarFormato,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToolbarFormato>;

export const EditorDeAnotacoes: Story = {
  render: () => {
    const editorRef = useRef<HTMLDivElement>(null);
    return (
      <div className="w-96 flex flex-col">
        <label className="text-xs font-bold uppercase text-zinc-400 mb-1">
          Anotações de Investigação
        </label>
        <ToolbarFormato editorRef={editorRef} />
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-24 w-full rounded-b border border-zinc-700 bg-zinc-900/40 p-3 text-sm text-zinc-100 outline-none focus:border-green-600 transition"
        >
          Encontramos um símbolo estranho cravado na parede do necrotério...
        </div>
      </div>
    );
  },
};
