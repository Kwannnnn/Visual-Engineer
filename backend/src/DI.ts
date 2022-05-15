import { EntityRepository, MikroORM } from '@mikro-orm/core';
import Item from './database/models/Item';

const DI = {} as {
  orm: MikroORM,
  itemRepository: EntityRepository<Item>,
}; // Use this ORM instance to interact with the database

export default DI;
