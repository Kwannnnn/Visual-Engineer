/* eslint-disable class-methods-use-this */
import type { EntityManager, Dictionary } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Relationship } from '../models';

export const sampleRelationships: Relationship[] = [];
export default class RelationshipSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // Make sure to empty the array every time the seeder is used
    sampleRelationships.length = 0;

    const relationship = em.create(Relationship, {
      pipeline: context.sampleBoards[0].items[0],
      firstItem: context.sampleBoards[0].items[3],
      secondItem: context.sampleBoards[0].items[1],
    });

    sampleRelationships.push(relationship);
  }
}
