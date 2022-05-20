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

  describe('DELETE /boards/:id', () => {
    describe('given the board exists', () => {
      it('should return 204', async () => {
        const board = sampleBoards[0];
        const response = await request(app).delete(`/api/v1/boards/${board.id}`);
        expect(response.status).toEqual(204);
      });
    });

    describe('given the board does not exist', () => {
      it('should return 404', async () => {
        const response = await request(app).delete('/api/v1/boards/4000');
        expect(response.status).toEqual(404);
      });
    });
  });

  describe('DELETE /boards/:id/objects/:tag', () => {
    describe('given the board exists', () => {
      describe('given the item exists', () => {
        it('should return 204', async () => {
          const board = sampleBoards[0];
          const item = board.items.getItems()[0];
          const response = await request(app).delete(`/api/v1/boards/${board.id}/objects/${item.tag}`);
          expect(response.status).toEqual(204);
        });
      });

      describe('given the item does not exists', () => {
        it('should return a success message', async () => {
          const board = sampleBoards[0];
          await board.items.init();
          const response = await request(app).delete(`/api/v1/boards/${board.id}/objects/blah123`);
          expect(response.status).toEqual(404);
        });
      });
    });

    describe('given the board does not exist', () => {
      it('should return 404', async () => {
        const response = await request(app).delete('/api/v1/boards/4000/objects/blah123');
        expect(response.status).toEqual(404);
      });
    });
  });
});
