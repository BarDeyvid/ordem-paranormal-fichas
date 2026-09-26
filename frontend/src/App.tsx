import { RPGProvider, useRPG } from './context/RPGContext';
import { AtributosScreen } from './screens/AtributosScreen';
import { OrigensScreen } from './screens/OrigensScreen';
import { ClasseScreen } from './screens/ClasseScreen';
import { FichaScreen } from './screens/Ficha';
import { GaleriaScreen } from './screens/GaleriaScreen';
import { BestiarioScreen } from './screens/BestiarioScreen';
import { BattlematScreen } from './screens/BattlematScreen';

function Rotas() {
  const { telaAtual } = useRPG();

  switch (telaAtual) {
    case 'origens':
      return <OrigensScreen />;
    case 'classe':
      return <ClasseScreen />;
    case 'ficha':
      return <FichaScreen />;
    case 'galeria':
      return <GaleriaScreen />;
    case 'bestiario':
      return <BestiarioScreen />;
    case 'battlemat':
      return <BattlematScreen />;
    case 'atributos':
    default:
      return <AtributosScreen />;
  }
}

function App() {
  return (
    <RPGProvider>
      <AppContent />
    </RPGProvider>
  );
}

function AppContent() {
  const { telaAtual } = useRPG();
  
  const isFullScreen = telaAtual === 'ficha' || telaAtual === 'galeria' || telaAtual === 'bestiario' || telaAtual === 'battlemat';

  return (
    <div className={`min-h-screen w-full bg-zinc-950 overflow-x-hidden ${isFullScreen ? '' : 'p-4 md:p-6'}`}>
      <Rotas />
    </div>
  );
}

export default App;
