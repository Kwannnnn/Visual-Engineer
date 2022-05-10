import { ReflectMetadataProvider } from '@mikro-orm/core';

export default {
  entities: ['./dist/database/models'],
  entitiesTs: ['./src/database/models'],
  clientUrl: process.env.DATABASE_URL,
  type: 'postgresql',
  metadataProvider: ReflectMetadataProvider,
};
