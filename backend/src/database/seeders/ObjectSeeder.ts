/* eslint-disable class-methods-use-this */
import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Pipeline } from '../models';
import PressureClass from '../models/PressureClass.enum';

export default class ObjectSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const item = new Pipeline(
      '69',
      'seedPipeline',
      69.69,
      69.69,
      69.69,
      69.69,
      PressureClass.PN10,
      'seedFlange',
      'seedLining',
    );
    em.create(Pipeline, item);
    context.board.items.add(item);
  }
}
