import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AgenteCard } from '../components/AgenteCard';
import type { FichaSummary } from '../types';

const meta: Meta<typeof AgenteCard> = {
  title: 'Galeria/AgenteCard',
  component: AgenteCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AgenteCard>;

const mockCombatente: FichaSummary = {
  id: 'dossier-001-arthur',
  nome: 'Arthur Cervero',
  jogador: 'Guaxinim',
  classe: 'Combatente',
  trilha: 'Aniquilador',
  origem: 'Militar',
  nex: 40,
  nivel: 8,
  patente: 'Agente Especial',
  pvAtual: 45,
  pvMax: 58,
  sanAtual: 28,
  sanMax: 36,
  peAtual: 18,
  peMax: 24,
  dataAtualizacao: new Date().toISOString(),
};

const mockOcultista: FichaSummary = {
  id: 'dossier-002-dante',
  nome: 'Dante',
  jogador: 'Rakin',
  classe: 'Ocultista',
  trilha: 'Graduado',
  origem: 'Acadêmico',
  nex: 65,
  nivel: 13,
  patente: 'Oficial de Operações',
  pvAtual: 30,
  pvMax: 42,
  sanAtual: 48,
  sanMax: 70,
  peAtual: 52,
  peMax: 65,
  dataAtualizacao: new Date(Date.now() - 3600000 * 5).toISOString(),
};

const mockEspecialista: FichaSummary = {
  id: 'dossier-003-joui',
  nome: 'Joui Jouki',
  jogador: 'Luba',
  classe: 'Especialista',
  trilha: 'Infiltrador',
  origem: 'Atleta',
  nex: 25,
  nivel: 5,
  patente: 'Operador',
  pvAtual: 36,
  pvMax: 36,
  sanAtual: 32,
  sanMax: 40,
  peAtual: 15,
  peMax: 20,
  dataAtualizacao: new Date(Date.now() - 86400000 * 2).toISOString(),
};

const mockRecruta: FichaSummary = {
  id: 'dossier-004-recruta',
  nome: 'Novo Recruta',
  jogador: 'Novato',
  classe: 'Nenhuma',
  trilha: '',
  origem: 'Vítima',
  nex: 5,
  nivel: 1,
  patente: 'Recruta',
  pvAtual: 16,
  pvMax: 16,
  sanAtual: 12,
  sanMax: 12,
  peAtual: 4,
  peMax: 4,
  dataAtualizacao: new Date(Date.now() - 86400000 * 7).toISOString(),
};

export const Combatente: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-zinc-950 p-6 rounded-xl">
      <AgenteCard
        agente={mockCombatente}
        isActive={false}
        onAbrir={(id) => alert(`Abrir ${id}`)}
        onDuplicar={(id) => alert(`Duplicar ${id}`)}
        onDeletar={(id) => alert(`Deletar ${id}`)}
        onExportar={(id) => alert(`Exportar ${id}`)}
      />
    </div>
  ),
};

export const Ocultista: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-zinc-950 p-6 rounded-xl">
      <AgenteCard
        agente={mockOcultista}
        isActive={true}
        onAbrir={(id) => alert(`Abrir ${id}`)}
        onDuplicar={(id) => alert(`Duplicar ${id}`)}
        onDeletar={(id) => alert(`Deletar ${id}`)}
        onExportar={(id) => alert(`Exportar ${id}`)}
      />
    </div>
  ),
};

export const Especialista: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-zinc-950 p-6 rounded-xl">
      <AgenteCard
        agente={mockEspecialista}
        isActive={false}
        onAbrir={(id) => alert(`Abrir ${id}`)}
        onDuplicar={(id) => alert(`Duplicar ${id}`)}
        onDeletar={(id) => alert(`Deletar ${id}`)}
        onExportar={(id) => alert(`Exportar ${id}`)}
      />
    </div>
  ),
};

export const Recruta: Story = {
  render: () => (
    <div className="max-w-md mx-auto bg-zinc-950 p-6 rounded-xl">
      <AgenteCard
        agente={mockRecruta}
        isActive={false}
        onAbrir={(id) => alert(`Abrir ${id}`)}
        onDuplicar={(id) => alert(`Duplicar ${id}`)}
        onDeletar={(id) => alert(`Deletar ${id}`)}
        onExportar={(id) => alert(`Exportar ${id}`)}
      />
    </div>
  ),
};
