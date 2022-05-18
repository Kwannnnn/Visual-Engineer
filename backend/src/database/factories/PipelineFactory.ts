/* eslint-disable class-methods-use-this */
import { Factory, Faker } from '@mikro-orm/seeder';
import { Pipeline } from '../models';
import PressureClass from '../models/PressureClass.enum';

export default class PipelineFactory extends Factory<Pipeline> {
  model = Pipeline;

  definition(faker: Faker): Partial<Pipeline> {
    return {
      tag: faker.datatype.uuid(),
      name: faker.datatype.string(),
      length: faker.datatype.float(),
      width: faker.datatype.float(),
      depth: faker.datatype.float(),
      diameter: faker.datatype.float(),
      pressureClass: PressureClass.PN10,
      flange: faker.datatype.string(),
      lining: faker.datatype.string(),
    };
  }
}
