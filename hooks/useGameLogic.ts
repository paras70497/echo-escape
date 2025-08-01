
import { useState, useEffect, useCallback, useRef } from 'react';
import { Cell, Position, GameState, Enemy, SoundPulse, CellType } from '../types';
import { generateMaze } from '../utils/mazeGenerator';
import { 
  GRID_WIDTH, 
  GRID_HEIGHT, 
  GAME_TICK_MS, 
  ENEMY_COUNT, 
  PULSE_RADIUS, 
  PULSE_GROWTH_RATE, 
  NOISE_PER_PULSE, 
  NOISE_DECAY_RATE,
  MAX_NOISE,
  PLAYER_FOV,
  ENEMY_HEARING_RANGE,
  ENEMY_STUN_DURATION
} from '../constants';

export const useGameLogic = () => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [player, setPlayer] = useState<Position>({ x: 1, y: 1 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [exit, setExit] = useState<Position>({ x: GRID_WIDTH - 2, y: GRID_HEIGHT - 2 });
  const [gameState, setGameState] = useState<GameState>('start');
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [soundPulses, setSoundPulses] = useState<SoundPulse[]>([]);
  
  const gameTickRef = useRef<NodeJS.Timeout>();

  const resetGame = useCallback(() => {
    const { maze: newMaze, start, exit: newExit } = generateMaze(GRID_WIDTH, GRID_HEIGHT);
    setMaze(newMaze);
    setPlayer(start);
    setExit(newExit);
    
    const pathCells: Position[] = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (newMaze[y][x].type === CellType.PATH && (Math.abs(x - start.x) > 10 || Math.abs(y - start.y) > 10)) {
          pathCells.push({x, y});
        }
      }
    }

    const newEnemies: Enemy[] = [];
    for(let i=0; i<ENEMY_COUNT; i++) {
        const randomIndex = Math.floor(Math.random() * pathCells.length);
        if(pathCells[randomIndex]){
            newEnemies.push({ id: i, pos: pathCells[randomIndex], lastKnownPlayerPos: null, isStunned: 0 });
            pathCells.splice(randomIndex, 1);
        }
    }
    setEnemies(newEnemies);

    setNoiseLevel(0);
    setSoundPulses([]);
    setGameState('playing');
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const updateVisibility = useCallback(() => {
    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => row.map(cell => ({ ...cell, visibility: 0 })));

      // Player FOV
      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          const dist = Math.sqrt(Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2));
          if (dist <= PLAYER_FOV) {
            newMaze[y][x].visibility = 1;
          }
        }
      }

      // Sound pulse visibility
      soundPulses.forEach(pulse => {
        for (let y = 0; y < GRID_HEIGHT; y++) {
          for (let x = 0; x < GRID_WIDTH; x++) {
            const dist = Math.sqrt(Math.pow(pulse.pos.x - x, 2) + Math.pow(pulse.pos.y - y, 2));
            if (dist <= pulse.radius) {
              newMaze[y][x].visibility = Math.max(newMaze[y][x].visibility, 2);
            }
          }
        }
      });

      return newMaze;
    });
  }, [player, soundPulses]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    // Update Pulses
    setSoundPulses(prev => 
      prev
        .map(p => ({ ...p, radius: p.radius + PULSE_GROWTH_RATE }))
        .filter(p => p.radius < p.maxRadius)
    );

    // Update Enemies
    setEnemies(prevEnemies => {
      return prevEnemies.map(enemy => {
        if (enemy.isStunned > 0) {
          return { ...enemy, isStunned: enemy.isStunned - 1 };
        }

        let nextPos = enemy.pos;
        if(enemy.lastKnownPlayerPos) {
            const target = enemy.lastKnownPlayerPos;
            const dx = Math.sign(target.x - enemy.pos.x);
            const dy = Math.sign(target.y - enemy.pos.y);

            let moved = false;
            // Try moving horizontally
            if (dx !== 0 && maze[enemy.pos.y][enemy.pos.x + dx].type !== CellType.WALL) {
                nextPos = { x: enemy.pos.x + dx, y: enemy.pos.y };
                moved = true;
            }
            // Try moving vertically if horizontal is blocked or not an option
            if (!moved && dy !== 0 && maze[enemy.pos.y + dy][enemy.pos.x].type !== CellType.WALL) {
                nextPos = { x: enemy.pos.x, y: enemy.pos.y + dy };
            }

            if (nextPos.x === target.x && nextPos.y === target.y) {
              return { ...enemy, pos: nextPos, lastKnownPlayerPos: null };
            }
        }
        return { ...enemy, pos: nextPos };
      });
    });

    // Update Noise
    setNoiseLevel(prev => Math.max(0, prev - NOISE_DECAY_RATE));
    
    // Update Visibility
    updateVisibility();

    // Check Win/Loss
    if (player.x === exit.x && player.y === exit.y) {
      setGameState('won');
    }
    enemies.forEach(enemy => {
      if (enemy.pos.x === player.x && enemy.pos.y === player.y) {
        setGameState('lost');
      }
    });

  }, [gameState, player, exit, enemies, maze, updateVisibility]);
  
  useEffect(() => {
    gameTickRef.current = setInterval(gameLoop, GAME_TICK_MS);
    return () => {
      if (gameTickRef.current) clearInterval(gameTickRef.current);
    };
  }, [gameLoop]);
  
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;
    const newPos = { x: player.x + dx, y: player.y + dy };
    if (
      newPos.x >= 0 && newPos.x < GRID_WIDTH &&
      newPos.y >= 0 && newPos.y < GRID_HEIGHT &&
      maze[newPos.y][newPos.x].type !== CellType.WALL
    ) {
      setPlayer(newPos);
    }
  }, [player, maze, gameState]);

  const createPulse = useCallback(() => {
    if (gameState !== 'playing') return;
    const newPulse = { id: Date.now(), pos: player, radius: 0, maxRadius: PULSE_RADIUS };
    setSoundPulses(prev => [...prev, newPulse]);
    setNoiseLevel(prev => Math.min(MAX_NOISE, prev + NOISE_PER_PULSE));

    // Alert enemies
    const alertRange = ENEMY_HEARING_RANGE + (noiseLevel / MAX_NOISE) * 5;
    setEnemies(prev => prev.map(enemy => {
      const dist = Math.sqrt(Math.pow(player.x - enemy.pos.x, 2) + Math.pow(player.y - enemy.pos.y, 2));
      if (dist <= alertRange) {
        return { ...enemy, lastKnownPlayerPos: player, isStunned: 0 };
      }
      if (dist <= PULSE_RADIUS / 2) {
          return {...enemy, isStunned: ENEMY_STUN_DURATION};
      }
      return enemy;
    }));
  }, [player, gameState, noiseLevel]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          movePlayer(1, 0);
          break;
        case ' ':
          createPulse();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, createPulse]);

  return { maze, player, enemies, exit, gameState, noiseLevel, soundPulses, resetGame };
};
