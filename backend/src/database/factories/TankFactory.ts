/* eslint-disable class-methods-use-this */
import { Factory, Faker } from '@mikro-orm/seeder';
import { Tank } from '../models';

export default class VesselFactory extends Factory<Tank> {
  model = Tank;

  definition(faker: Faker): Partial<Tank> {
    return {
      tag: faker.datatype.uuid(),
      name: faker.datatype.string(),
      length: faker.datatype.float(),
      width: faker.datatype.float(),
      depth: faker.datatype.float(),
      diameter: faker.datatype.float(),
      emptyMass: faker.datatype.float(),
      head: faker.datatype.float(),
      filledMass: faker.datatype.float(),
      netVolume: faker.datatype.float(),
      grossVolume: faker.datatype.float(),
      x: faker.datatype.float(),
      y: faker.datatype.float(),
      type: 'tank',
    };
  }
}
