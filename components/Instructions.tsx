
import React from 'react';

export const Instructions: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">How to Play Echo Escape</h2>
      <ul className="space-y-3">
        <li className="flex items-start">
          <span className="text-cyan-400 mr-3 text-xl font-mono">&#9654;</span>
          <div>
            <strong className="text-white">Move:</strong> Use <kbd className="font-sans bg-gray-900 text-cyan-300 rounded px-2 py-1">WASD</kbd> or <kbd className="font-sans bg-gray-900 text-cyan-300 rounded px-2 py-1">Arrow Keys</kbd> to navigate.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-cyan-400 mr-3 text-xl font-mono">&#9654;</span>
          <div>
            <strong className="text-white">Echo:</strong> Press <kbd className="font-sans bg-gray-900 text-cyan-300 rounded px-2 py-1">Spacebar</kbd> to send out a sound pulse.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-cyan-400 mr-3 text-xl font-mono">&#9654;</span>
          <div>
            The pulse reveals the maze around you but increases your <strong className="text-yellow-400">Noise Level</strong>.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-cyan-400 mr-3 text-xl font-mono">&#9654;</span>
          <div>
            <strong className="text-red-500">Enemies</strong> are drawn to the location of your last echo. High noise makes them more aware.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-cyan-400 mr-3 text-xl font-mono">&#9654;</span>
          <div>
            Find the <strong className="text-emerald-500">green exit</strong> without getting caught to win!
          </div>
        </li>
      </ul>
    </div>
  );
};
