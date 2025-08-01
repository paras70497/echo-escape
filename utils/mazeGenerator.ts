
import { GRID_WIDTH, GRID_HEIGHT } from '../constants';
import { CellType, Position, Cell } from '../types';

const shuffle = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateMaze = (width: number, height: number): {maze: Cell[][], start: Position, exit: Position} => {
  const maze: Cell[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ type: CellType.WALL, visibility: 0 }))
  );

  const start: Position = { x: 1, y: 1 };
  const exit: Position = { x: width - 2, y: height - 2 };

  const stack: Position[] = [];
  const visited: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));

  const carve = (pos: Position) => {
    maze[pos.y][pos.x].type = CellType.PATH;
    visited[pos.y][pos.x] = true;
  };

  carve(start);
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    
    const neighbors = [
      { x: 0, y: -2 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
      { x: -2, y: 0 },
    ];
    
    const unvisitedNeighbors: Position[] = [];

    for (const neighbor of shuffle(neighbors)) {
      const nx = current.x + neighbor.x;
      const ny = current.y + neighbor.y;

      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && !visited[ny][nx]) {
        unvisitedNeighbors.push({ x: nx, y: ny });
      }
    }

    if (unvisitedNeighbors.length > 0) {
      const next = unvisitedNeighbors[0];
      const wall: Position = {
        x: current.x + (next.x - current.x) / 2,
        y: current.y + (next.y - current.y) / 2,
      };
      
      carve(wall);
      carve(next);
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  maze[exit.y][exit.x].type = CellType.EXIT;
  
  // Place a few enemies in valid path locations
  const pathCells: Position[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (maze[y][x].type === CellType.PATH && (x > width / 2 || y > height / 2)) {
        pathCells.push({x, y});
      }
    }
  }

  return { maze, start, exit };
};
