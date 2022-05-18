import { ReflectMetadataProvider } from '@mikro-orm/core';

export default {
  entities: ['./dist/database/models'],
  entitiesTs: ['./src/database/models'],
  clientUrl: process.env.DATABASE_URL,
  type: 'postgresql',
  metadataProvider: ReflectMetadataProvider,
  seeder: {
    path: './dist/database/seeders',
    pathTs: './src/database/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
};
