import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { PipeFitting } from './database/models';

const DI = {} as {
  orm: MikroORM,
  itemRepository: EntityRepository<PipeFitting>,
}; // Use this ORM instance to interact with the database

export default DI;
