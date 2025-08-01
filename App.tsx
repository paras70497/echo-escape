
import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameBoard } from './components/GameBoard';
import { NoiseMeter } from './components/NoiseMeter';
import { Instructions } from './components/Instructions';
import { GameOverModal } from './components/GameOverModal';

const App: React.FC = () => {
  const { maze, player, enemies, exit, gameState, noiseLevel, soundPulses, resetGame } = useGameLogic();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <header className="w-full max-w-7xl text-center mb-4">
        <h1 className="text-5xl font-bold text-cyan-300 tracking-wider" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}>
          Echo Escape
        </h1>
      </header>
      
      <main className="flex flex-col lg:flex-row items-start gap-8 w-full max-w-7xl">
        <div className="flex-grow flex items-center justify-center relative">
            <GameBoard 
              maze={maze} 
              player={player} 
              enemies={enemies} 
              exit={exit} 
              soundPulses={soundPulses} 
            />
            <GameOverModal gameState={gameState} onRestart={resetGame} />
        </div>
        
        <aside className="w-full lg:w-96 flex-shrink-0 space-y-6">
          <Instructions />
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Noise Level</h3>
            <p className="text-sm text-gray-400 mb-3">Higher noise makes enemies more aware of your presence.</p>
            <NoiseMeter level={noiseLevel} />
          </div>
        </aside>
      </main>
      <footer className="mt-8 text-gray-500 text-sm">
        <p>A game of stealth and sound. Use your echoes wisely.</p>
      </footer>
    </div>
  );
};

export default App;
