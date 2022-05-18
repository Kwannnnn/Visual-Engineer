import request from 'supertest';
import { ISeedManager } from '@mikro-orm/core';
import setup from '../../index';
import DI from '../../DI';
import DatabaseSeeder from '../../database/seeders/DatabaseSeeder';
import { sampleBoards } from '../../database/seeders/BoardSeeder';

let app: Express.Application;

beforeEach(async () => {
  app = await setup();
  await DI.orm.getSchemaGenerator().refreshDatabase();
  const seeder: ISeedManager = DI.orm.getSeeder();
  await seeder.seed(DatabaseSeeder);
});

afterEach(async () => {
  await DI.orm.getSchemaGenerator().clearDatabase();
  await DI.orm.close();
});

describe('/boards', () => {
  describe('GET /boards', () => {
    it('should return a list of all existing boards', async () => {
      const response = await request(app).get('/api/v1/boards');
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(3);
    });
  });

  describe('GET /boards/:id', () => {
    describe('given the board exists', () => {
      it('should return an existing board', async () => {
        const { id, name } = sampleBoards[0];
        const response = await request(app).get(`/api/v1/boards/${id}`);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ id, name });
      });
    });

    describe('given the board does not exist', () => {
      it('should return 404', async () => {
        const response = await request(app).get('/api/v1/boards/4000');
        expect(response.status).toEqual(404);
      });
    });
  });
});
