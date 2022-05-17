import Board from '../../database/models/Board';

export interface BoardParams {
  id: number;
}

export type PatchBoardBody = Pick<Board, 'name'>;
