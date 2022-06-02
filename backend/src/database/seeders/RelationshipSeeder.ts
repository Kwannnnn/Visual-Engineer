/* eslint-disable class-methods-use-this */
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BlowerFactory, PipelineFactory, PumpFactory } from '../factories';
import {
  Pipeline, Pump, Blower, Relationship,
} from '../models';

export const sampleRelationships: Relationship[] = [];
export default class RelationshipSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Make sure to empty the array every time the seeder is used
    sampleRelationships.length = 0;

    // Add a pipeline and two other items
    const pipeline: Pipeline = new PipelineFactory(em).makeOne({ board: 1 });
    const firstItem: Pump = new PumpFactory(em).makeOne({ board: 1 });
    const secondItem: Blower = new BlowerFactory(em).makeOne({ board: 1 });

    const relationship: Relationship = {
      pipeline, firstItem, secondItem,
    };

    sampleRelationships.push(relationship);
  }
}
