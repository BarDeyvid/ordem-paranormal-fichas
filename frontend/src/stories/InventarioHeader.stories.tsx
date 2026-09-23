import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { InventarioHeader, type InventarioHeaderProps } from '../components/InventarioHeader';
import type { Patente, LimiteCredito } from '../hooks/useInventario';

const meta: Meta<typeof InventarioHeader> = {
  title: 'Ordem Paranormal/Inventário/InventarioHeader',
  component: InventarioHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof InventarioHeader>;

const HeaderWrapper = (props: Partial<InventarioHeaderProps>) => {
  const [prestigio, setPrestigio] = useState(props.prestigio ?? 20);
  const [patente, setPatente] = useState<Patente>(props.patente ?? 'Operador');
  const [credito, setCredito] = useState<LimiteCredito>(props.credito ?? 'Médio');
  const [limites, setLimites] = useState(props.limitesItens ?? [2, 1, 0, 0]);

  return (
    <div className="w-[420px] bg-zinc-950 p-4 border border-zinc-800 rounded">
      <InventarioHeader
        prestigio={prestigio}
        setPrestigio={setPrestigio}
        patente={patente}
        setPatenteManual={setPatente}
        credito={credito}
        setCreditoOverride={setCredito}
        cargaAtual={props.cargaAtual ?? 8}
        cargaMaxima={props.cargaMaxima ?? 10}
        limitesItens={limites}
        setLimiteItemCategoria={(idx, val) => {
          const next = [...limites];
          next[idx] = val;
          setLimites(next);
        }}
        noInventario={props.noInventario ?? [2, 1, 0, 0]}
      />
    </div>
  );
};

export const Normal: Story = {
  render: () => (
    <HeaderWrapper
      prestigio={35}
      patente="Agente Especial"
      credito="Alto"
      cargaAtual={7}
      cargaMaxima={10}
      limitesItens={[3, 2, 1, 0]}
      noInventario={[2, 2, 1, 0]}
    />
  ),
};

export const SobrecargaELimiteExcedido: Story = {
  render: () => (
    <HeaderWrapper
      prestigio={5}
      patente="Recruta"
      credito="Baixo"
      cargaAtual={12}
      cargaMaxima={10}
      limitesItens={[2, 0, 0, 0]}
      noInventario={[3, 1, 0, 0]}
    />
  ),
};
