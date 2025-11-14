import { World3D } from './components/World3D';
import { HUD } from './components/ui/HUD';
import { RealEstateUI } from './components/ui/RealEstateUI';
import { CareerUI } from './components/ui/CareerUI';
import { Notifications } from './components/ui/Notifications';
import { Chat } from './components/ui/Chat';
import { Controls } from './components/ui/Controls';
import { Welcome } from './components/ui/Welcome';

function App() {
  return (
    <div className="relative w-full h-full">
      {/* Welcome Screen */}
      <Welcome />
      
      {/* 3D World */}
      <World3D />
      
      {/* UI Overlays */}
      <HUD />
      <Controls />
      <RealEstateUI />
      <CareerUI />
      <Chat />
      <Notifications />
    </div>
  );
}

export default App;
