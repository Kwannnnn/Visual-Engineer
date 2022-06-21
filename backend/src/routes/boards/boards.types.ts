import {
  Board, PipeFitting, Pump, Blower, Tank, Vessel, Pipeline,
} from '../../database/models';

export interface BoardParams {
  id: number;
}

export type PatchBoardBody = Pick<Board, 'name'>;

export interface BoardObjectParams extends BoardParams {
  objectId: number;
}
interface IPatchBoardObject extends Pipeline, PipeFitting, Pump, Blower, Tank, Vessel {

}

export type PatchBoardObject = Omit<IPatchBoardObject, 'board'>;

export interface FieldError {
  msg: string;
  param: string;
  location: string;
}
