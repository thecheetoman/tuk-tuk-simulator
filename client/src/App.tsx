import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Game from "./components/Game";
import GameMenu from "./components/GameMenu";
import SettingsMenu from "./components/SettingsMenu";
import SoundManager from "./components/SoundManager";
import UIOverlay from "./components/UIOverlay";
import LoadingScreen from "./components/LoadingScreen";
import "@fontsource/inter";
import "./index.css";

// Define control keys for the tuk tuk
enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  brake = 'brake',
  boost = 'boost',
  cameraSwitch = 'cameraSwitch',
  pause = 'pause'
}

const keyMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.brake, keys: ['Space'] },
  { name: Controls.boost, keys: ['ShiftLeft', 'ShiftRight'] },
  { name: Controls.cameraSwitch, keys: ['KeyC'] },
  { name: Controls.pause, keys: ['KeyP'] }
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [gameState, setGameState] = useState<'loading' | 'menu' | 'playing' | 'settings' | 'paused'>('loading');

  const handleStart = () => {
    setGameState('playing');
  };

  const handleSettings = () => {
    setGameState('settings');
  };

  const handlePause = () => {
    console.log('Pause requested, current state:', gameState);
    setGameState('paused');
  };

  const handleResume = () => {
    console.log('Resume requested, current state:', gameState);
    setGameState('playing');
  };

  const handleMainMenu = () => {
    setGameState('menu');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        {gameState === 'loading' && (
          <LoadingScreen onLoadingComplete={() => setGameState('menu')} />
        )}
        
        <KeyboardControls map={keyMap}>
          <Canvas
            shadows
            camera={{
              position: [0, 10, 20],
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance"
            }}
          >
            <color attach="background" args={["#2F2F2F"]} />
            
            {/* Enhanced atmosphere with better fog */}
            <fog attach="fog" args={["#87CEEB", 100, 1000]} />
            
            {/* Sun-like lighting system */}
            <ambientLight intensity={0.4} color="#FFF8DC" />
            <directionalLight 
              position={[200, 300, 200]} 
              intensity={1.2}
              color="#FFE5B4"
              castShadow
              shadow-mapSize-width={4096}
              shadow-mapSize-height={4096}
              shadow-camera-far={1000}
              shadow-camera-left={-500}
              shadow-camera-right={500}
              shadow-camera-top={500}
              shadow-camera-bottom={-500}
              shadow-bias={-0.0005}
            />
            
            {/* Additional rim lighting */}
            <directionalLight 
              position={[-100, 200, -100]} 
              intensity={0.3}
              color="#87CEEB"
            />
            
            <Suspense fallback={null}>
              {gameState !== 'loading' && (
                <Game 
                  gameState={gameState} 
                  onPause={handlePause}
                  onResume={handleResume}
                  onMainMenu={handleMainMenu}
                  onSettings={handleSettings}
                />
              )}
              <SoundManager />
            </Suspense>
          </Canvas>
        </KeyboardControls>
        
        <GameMenu 
          isVisible={gameState === 'menu'} 
          onStart={handleStart}
          onSettings={handleSettings}
        />
        
        <SettingsMenu 
          isVisible={gameState === 'settings'} 
          onBack={() => setGameState('menu')}
        />
        
        <UIOverlay isVisible={gameState === 'playing' || gameState === 'paused'} />
      </div>
    </QueryClientProvider>
  );
}

export { Controls };
export default App;
