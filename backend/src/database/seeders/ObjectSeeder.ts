/* eslint-disable class-methods-use-this */
import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {
  BlowerFactory, PipeFittingFactory, PipelineFactory, PumpFactory, TankFactory,
} from '../factories';
import { Item } from '../models';

export const sampleBoardObjects: Item[] = [];
export default class ObjectSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // Make sure to empty the array every time the seeder is used
    sampleBoardObjects.length = 0;

    // Get the board items list form the board attached to context
    const { id: sampleBoardId, items: sampleBoardItems } = await context.sampleBoards[0];

    // Add sample items to the exported array
    sampleBoardObjects.push(new PipelineFactory(em).makeOne({ board: sampleBoardId, id: 'PL01' }));
    sampleBoardObjects.push(new PumpFactory(em).makeOne({
      board: sampleBoardId,
      id: 'PU01',
      x: 50,
      y: 50,
    }));
    sampleBoardObjects.push(new BlowerFactory(em).makeOne({
      board: sampleBoardId,
      id: 'BL01',
      x: 250,
      y: 125,
    }));
    sampleBoardObjects.push(new PipeFittingFactory(em).makeOne({
      board: sampleBoardId,
      id: 'PF01',
      x: 250,
      y: 500,
    }));
    sampleBoardObjects.push(new PipelineFactory(em).makeOne({ board: sampleBoardId, id: 'PL02' }));
    sampleBoardObjects.push(new TankFactory(em).makeOne({
      board: sampleBoardId,
      id: 'T01',
      x: 610,
      y: 200,
    }));
    sampleBoardObjects.push(new PipeFittingFactory(em).makeOne({
      board: sampleBoardId,
      id: 'PF02',
      x: 900,
      y: 200,
    }));

    // Assign the newly created items to the sample board
    sampleBoardObjects.forEach((object) => sampleBoardItems.add(object));
  }
}
