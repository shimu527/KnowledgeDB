export type CellType = 
  | 'text' 
  | 'number' 
  | 'latex' 
  | 'markdown' 
  | 'code'
  | 'select'
  | 'multiSelect'
  | 'date'
  | 'url';

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