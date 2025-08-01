
export enum CellType {
  WALL,
  PATH,
  EXIT,
}

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  type: CellType;
  visibility: number; // 0 = hidden, 1 = player fov, >1 = pulse visibility
}

export interface Enemy {
  id: number;
  pos: Position;
  lastKnownPlayerPos: Position | null;
  isStunned: number;
}

export interface SoundPulse {
  id: number;
  pos: Position;
  radius: number;
  maxRadius: number;
}

export type GameState = 'start' | 'playing' | 'won' | 'lost';
