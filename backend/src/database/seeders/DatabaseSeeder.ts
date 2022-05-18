/* eslint-disable class-methods-use-this */
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import BoardSeeder from './BoardSeeder';
import ObjectSeeder from './ObjectSeeder';

export default class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [
      BoardSeeder,
      ObjectSeeder,
    ]);
  }
}
