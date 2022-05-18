/* eslint-disable class-methods-use-this */
import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import BoardFactory from '../factories/BoardFactory';
import Board from '../models/Board';

export const sampleBoards: Board[] = [];
export default class BoardSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // Make sure to empty the array every time the seeder is used
    sampleBoards.length = 0;

    // Create 3 sample boards
    const boards = new BoardFactory(em).make(3);

    /*
    * Attach the newly created boards to a shared context, so that
    * they can be referenced by other seeders.
    */
    context.sampleBoards = boards;

    // Assign the boards to the exported array
    boards.forEach((board) => {
      sampleBoards.push(board);
    });
  }
}
