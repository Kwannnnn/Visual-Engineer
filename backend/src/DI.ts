import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { Item } from './database/models';
import Board from './database/models/Board';

const DI = {} as {
  orm: MikroORM,
  itemRepository: EntityRepository<Item>,
  boardRepository: EntityRepository<Board>
}; // Use this ORM instance to interact with the database

export default DI;
