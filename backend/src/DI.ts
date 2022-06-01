import { EntityRepository, MikroORM, EntityManager } from '@mikro-orm/core';
import { Item, Board, Relationship } from './database/models';

const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
  itemRepository: EntityRepository<Item>,
  boardRepository: EntityRepository<Board>,
  relationshipRepository: EntityRepository<Relationship>
}; // Use this ORM instance to interact with the database

export default DI;
