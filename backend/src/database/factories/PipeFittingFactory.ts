/* eslint-disable class-methods-use-this */
import { Factory, Faker } from '@mikro-orm/seeder';
import { PipeFitting } from '../models';
import PressureClass from '../models/PressureClass.enum';

export default class PipeFittingFactory extends Factory<PipeFitting> {
  model = PipeFitting;

  definition(faker: Faker): Partial<PipeFitting> {
    return {
      tag: faker.datatype.uuid(),
      name: faker.datatype.string(),
      length: faker.datatype.float(),
      width: faker.datatype.float(),
      depth: faker.datatype.float(),
      diameter: faker.datatype.float(),
      pressureClass: PressureClass.PN10,
      x: faker.datatype.float({ min: -100, max: 100 }),
      y: faker.datatype.float({ min: -100, max: 100 }),
      type: 'pipeFitting',
    };
  }
}
