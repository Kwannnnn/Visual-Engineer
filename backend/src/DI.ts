import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Item, Board } from './database/models';

const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
  itemRepository: EntityRepository<Item>,
  boardRepository: EntityRepository<Board>
}; // Use this ORM instance to interact with the database

export default DI;
