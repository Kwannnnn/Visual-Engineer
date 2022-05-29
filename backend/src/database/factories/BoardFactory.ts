/* eslint-disable class-methods-use-this */
import { Factory, Faker } from '@mikro-orm/seeder';
import Board from '../models/Board';

export default class BoardFactory extends Factory<Board> {
  model = Board;

  definition(faker: Faker): Partial<Board> {
    return {
      name: faker.address.city(),
    };
  }
}
