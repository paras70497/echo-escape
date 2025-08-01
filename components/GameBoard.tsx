
import React from 'react';
import { Cell, Position, Enemy, SoundPulse, CellType } from '../types';
import { CELL_SIZE } from '../constants';

interface GameBoardProps {
  maze: Cell[][];
  player: Position;
  enemies: Enemy[];
  exit: Position;
  soundPulses: SoundPulse[];
}

const getCellClass = (cell: Cell) => {
  if (cell.visibility === 0) {
    return 'bg-black';
  }

  let baseColor;
  switch (cell.type) {
    case CellType.WALL:
      baseColor = 'bg-gray-700';
      break;
    case CellType.PATH:
      baseColor = 'bg-gray-800';
      break;
    case CellType.EXIT:
      baseColor = 'bg-emerald-600';
      break;
    default:
      baseColor = 'bg-gray-900';
  }

  if (cell.visibility === 1) { // Player FOV
    return `${baseColor} opacity-100`;
  }
  if (cell.visibility === 2) { // Pulse
    return `${baseColor} opacity-70`;
  }

  return 'bg-black';
};


export const GameBoard: React.FC<GameBoardProps> = ({ maze, player, enemies, exit, soundPulses }) => {
  if (!maze.length) return null;

  const width = maze[0].length * CELL_SIZE;
  const height = maze.length * CELL_SIZE;

  return (
    <div className="relative bg-black rounded-lg shadow-2xl shadow-cyan-500/20" style={{ width, height }}>
      {maze.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`transition-colors duration-500 ${getCellClass(cell)}`}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            />
          ))}
        </div>
      ))}
      
      {/* Player */}
      <div
        className="absolute rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 transition-all duration-100"
        style={{
          width: CELL_SIZE * 0.8,
          height: CELL_SIZE * 0.8,
          left: player.x * CELL_SIZE + CELL_SIZE * 0.1,
          top: player.y * CELL_SIZE + CELL_SIZE * 0.1,
          transitionProperty: 'left, top',
        }}
      />
      
      {/* Enemies */}
      {enemies.map((enemy) => (
        <div
          key={enemy.id}
          className={`absolute rounded-sm transition-all duration-100 ${enemy.isStunned > 0 ? 'bg-yellow-400 animate-pulse' : 'bg-red-500'}`}
          style={{
            width: CELL_SIZE * 0.8,
            height: CELL_SIZE * 0.8,
            left: enemy.pos.x * CELL_SIZE + CELL_SIZE * 0.1,
            top: enemy.pos.y * CELL_SIZE + CELL_SIZE * 0.1,
            transitionProperty: 'left, top',
          }}
        />
      ))}

      {/* Sound Pulses */}
      {soundPulses.map((pulse) => (
        <div
          key={pulse.id}
          className="absolute rounded-full border-2 border-cyan-300 pointer-events-none"
          style={{
            left: (pulse.pos.x + 0.5) * CELL_SIZE,
            top: (pulse.pos.y + 0.5) * CELL_SIZE,
            width: pulse.radius * 2 * CELL_SIZE,
            height: pulse.radius * 2 * CELL_SIZE,
            transform: 'translate(-50%, -50%)',
            opacity: 1 - pulse.radius / pulse.maxRadius,
            transition: 'width 100ms linear, height 100ms linear, opacity 100ms linear'
          }}
        />
      ))}
    </div>
  );
};
