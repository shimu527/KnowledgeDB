export type CellType = 'text' | 'latex' | 'code' | 'number' | 'markdown';

export interface Cell {
  type: CellType;
  content: string;
}

export interface Column {
  id: string;
  name: string;
  type: CellType;
}

export type TableData = Cell[][];