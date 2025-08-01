
import React from 'react';
import { GameState } from '../types';

interface GameOverModalProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ gameState, onRestart }) => {
  if (gameState !== 'won' && gameState !== 'lost') {
    return null;
  }

  const isWin = gameState === 'won';
  const title = isWin ? 'You Escaped!' : 'You Were Heard...';
  const message = isWin
    ? 'Your clever use of sound allowed you to find the way out.'
    : 'The silence is broken, and so is your escape. The echoes led them right to you.';
  const titleColor = isWin ? 'text-cyan-400' : 'text-red-500';

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-sm w-full mx-4">
        <h2 className={`text-4xl font-bold mb-4 ${titleColor}`}>{title}</h2>
        <p className="text-gray-300 mb-8">{message}</p>
        <button
          onClick={onRestart}
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
