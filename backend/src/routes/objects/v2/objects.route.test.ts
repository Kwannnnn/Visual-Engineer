import request from 'supertest';
import { ISeedManager } from '@mikro-orm/core';
import setup from '../../../index';
import DI from '../../../DI';
import DatabaseSeeder from '../../../database/seeders/DatabaseSeeder';

let app: Express.Application;

beforeEach(async () => {
  app = await setup();
  await DI.orm.getSchemaGenerator().refreshDatabase();
  const seeder: ISeedManager = DI.orm.getSeeder();
  await seeder.seed(DatabaseSeeder);
});

afterEach(async () => {
  await DI.orm.getSchemaGenerator().clearDatabase();
  DI.orm.close();
});

describe('V2 /objects', () => {
  describe('GET /objects/types/:type/properties', () => {
    describe('given the object type does exist', () => {
      it('should return the object type model properties for a pipeline', async () => {
        const type = 'pipeline';
        const response = await request(app).get(`/api/v2/objects/types/${type}/properties`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'length',
            type: 'number',
          },
          {
            name: 'width',
            type: 'number',
          },
          {
            name: 'depth',
            type: 'number',
          },
          {
            name: 'diameter',
            type: 'number',
          },
          {
            name: 'pressureClass',
            type: 'string',
          },
          {
            name: 'flange',
            type: 'string',
          },
          {
            name: 'lining',
            type: 'string',
          },
        ]);
      });

      it('should not return the object type model properties for a base item', async () => {
        const type = 'item';
        const response = await request(app).get(`/api/v2/objects/types/${type}/properties`);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
          message: 'Unknown Item type',
        });
      });
    });

    describe('given the object type does not exist', () => {
      it('should return 400', async () => {
        const response = await request(app).get('/api/v2/objects/types/badObject/properties');
        expect(response.statusCode).toEqual(400);
      });
    });
  });

  describe('GET /objects/types', () => {
    it('should return all object types', async () => {
      const response = await request(app).get('/api/v2/objects/types');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(1);
    });
  });
});
