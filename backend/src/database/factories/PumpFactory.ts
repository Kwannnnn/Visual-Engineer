/* eslint-disable class-methods-use-this */
import { Factory, Faker } from '@mikro-orm/seeder';
import { Pump } from '../models';

export default class PumpFactory extends Factory<Pump> {
  model = Pump;

  definition(faker: Faker): Partial<Pump> {
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
      preliminaryPower: faker.datatype.float(),
      finalPower: faker.datatype.float(),
    };
  }
}
