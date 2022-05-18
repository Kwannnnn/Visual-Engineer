/* eslint-disable class-methods-use-this */
import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import BoardFactory from '../factories/BoardFactory';

export default class BoardSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const boardFactory = new BoardFactory(em);
    context.board = boardFactory.makeOne({
      name: 'testBoard',
    });

    boardFactory.make(2);
  }
}
