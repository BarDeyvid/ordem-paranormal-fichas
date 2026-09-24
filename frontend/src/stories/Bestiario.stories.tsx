import type { Meta, StoryObj } from '@storybook/react-vite';
import { AmeacaCard } from '../components/Bestiario/AmeacaCard';
import { BestiarioScreen } from '../screens/BestiarioScreen';
import { AMEACAS_DATABASE } from '../data/ameacas';

const meta: Meta = {
  title: 'Ordem Paranormal/Bestiario',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const ZumbiDeSangue: StoryObj = {
  render: () => {
    const zumbi = AMEACAS_DATABASE.find(a => a.id === 'zumbi-de-sangue')!;
    return (
      <div className="max-w-2xl mx-auto p-4 bg-zinc-950 rounded-xl">
        <AmeacaCard ameaca={zumbi} />
      </div>
    );
  },
};

export const NidereEnergiaExpandido: StoryObj = {
  render: () => {
    const nidere = AMEACAS_DATABASE.find(a => a.id === 'nidere')!;
    return (
      <div className="max-w-2xl mx-auto p-4 bg-zinc-950 rounded-xl">
        <AmeacaCard ameaca={nidere} expandido={true} />
      </div>
    );
  },
};

export const ODiaboReliquia: StoryObj = {
  render: () => {
    const diabo = AMEACAS_DATABASE.find(a => a.id === 'o-diabo')!;
    return (
      <div className="max-w-2xl mx-auto p-4 bg-zinc-950 rounded-xl">
        <AmeacaCard ameaca={diabo} expandido={true} />
      </div>
    );
  },
};

export const TelaBestiarioCompleta: StoryObj = {
  render: () => <BestiarioScreen />,
};
