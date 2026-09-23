import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BarraStatus, type BarraStatusProps } from '../components/BarraStatus';

const meta: Meta<typeof BarraStatus> = {
  title: 'Ordem Paranormal/Status/BarraStatus',
  component: BarraStatus,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof BarraStatus>;

const BarraStatusWrapper = (props: BarraStatusProps) => {
  const [valAtual, setValAtual] = useState(props.valorAtual);
  const [valMax, setValMax] = useState(props.valorMax);
  const [hasTemp, setHasTemp] = useState(props.hasTemp ?? false);
  const [tempAtual, setTempAtual] = useState(props.tempAtual ?? 0);
  const [tempMax, setTempMax] = useState(props.tempMax ?? 0);

  const alterarStatus = (qtd: number) => {
    setValAtual((prev) => Math.max(0, Math.min(valMax, prev + qtd)));
  };

  return (
    <div className="w-[420px]">
      <BarraStatus
        {...props}
        valorAtual={valAtual}
        setValorAtual={setValAtual}
        valorMax={valMax}
        setValorMax={setValMax}
        hasTemp={hasTemp}
        setHasTemp={setHasTemp}
        tempAtual={tempAtual}
        setTempAtual={setTempAtual}
        tempMax={tempMax}
        setTempMax={setTempMax}
        alterarStatus={alterarStatus}
      />
    </div>
  );
};

export const Vida: Story = {
  render: () => (
    <BarraStatusWrapper
      titulo="Vida"
      corBarra="border-red-700 bg-red-950/40"
      corTempClasses="border-red-500 bg-red-950/20"
      valorAtual={28}
      valorMax={35}
      alterarStatus={() => {}}
      setValorAtual={() => {}}
      setValorMax={() => {}}
      hasTemp={false}
      tempAtual={0}
      tempMax={0}
    />
  ),
};

export const VidaComTemporario: Story = {
  render: () => (
    <BarraStatusWrapper
      titulo="Vida"
      corBarra="border-red-700 bg-red-950/40"
      corTempClasses="border-red-500 bg-red-950/20"
      valorAtual={35}
      valorMax={35}
      alterarStatus={() => {}}
      setValorAtual={() => {}}
      setValorMax={() => {}}
      hasTemp={true}
      tempAtual={10}
      tempMax={10}
    />
  ),
};

export const Sanidade: Story = {
  render: () => (
    <BarraStatusWrapper
      titulo="Sanidade"
      corBarra="border-blue-700 bg-blue-950/40"
      valorAtual={18}
      valorMax={24}
      alterarStatus={() => {}}
      setValorAtual={() => {}}
      setValorMax={() => {}}
    />
  ),
};

export const PontosDeEsforco: Story = {
  render: () => (
    <BarraStatusWrapper
      titulo="Pontos de Esforço"
      corBarra="border-yellow-700 bg-yellow-950/40"
      corTempClasses="border-yellow-500 bg-yellow-950/20"
      valorAtual={12}
      valorMax={20}
      alterarStatus={() => {}}
      setValorAtual={() => {}}
      setValorMax={() => {}}
      hasTemp={true}
      tempAtual={5}
      tempMax={5}
    />
  ),
};
