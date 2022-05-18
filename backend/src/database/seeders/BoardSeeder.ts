/* eslint-disable class-methods-use-this */
import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import Board from '../models/Board';

export default class BoardSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.board = em.create(Board, {
      name: 'seedBoard',
    });
  }
}
