import request from 'supertest';
import { ISeedManager } from '@mikro-orm/core';
import setup from '../../../index';
import DI from '../../../DI';
import DatabaseSeeder from '../../../database/seeders/DatabaseSeeder';
import { sampleBoardObjects } from '../../../database/seeders/ObjectSeeder';

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

describe('/objects', () => {
  describe('GET /objects', () => {
    it('should return a list of all existing objects', async () => {
      const response = await request(app).get('/api/v1/objects');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
    });
  });

  describe('GET /objects/:tag', () => {
    describe('given the object does exist', () => {
      it('should return an existing object', async () => {
        const { board, ...otherProps } = sampleBoardObjects[0];
        const response = await request(app).get(`/api/v1/objects/${otherProps.tag}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
          ...otherProps,
          board: board.id,
        });
      });
    });

    describe('given the object does not exist', () => {
      it('should return 404', async () => {
        const response = await request(app).get('/api/v1/objects/3737');
        expect(response.statusCode).toEqual(404);
      });
    });
  });

  describe('GET /objects/types', () => {
    it('should return all object types', async () => {
      const response = await request(app).get('/api/v1/objects/types');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(1);
    });
  });
});
