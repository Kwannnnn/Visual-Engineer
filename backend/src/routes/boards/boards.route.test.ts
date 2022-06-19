import request from 'supertest';
import { ISeedManager } from '@mikro-orm/core';
import setup from '../../index';
import DI from '../../DI';
import DatabaseSeeder from '../../database/seeders/DatabaseSeeder';
import { sampleBoards } from '../../database/seeders/BoardSeeder';

let app: Express.Application;

const exampleItem = {
  name: 'Cleaner',
  tag: 'CL01',
  length: 2.52,
  width: 2.35,
  depth: 1.47,
  diameter: 1.79,
  emptyMass: 69,
  head: 1,
  filledMass: 5.4,
  netVolume: 12.3,
  grossVolume: 23.7,
  preliminaryPower: 454,
  finalPower: 600,
  x: 12.4,
  y: 45.5,
  type: 'pump',
};

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

describe('GET Board endpoints', () => {
  describe('GET api/v1/boards', () => {
    it('should return all boards', async () => {
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

  describe('GET api/v1/boards/:id/objects', () => {
    describe('given the board exists', () => {
      it('should resturn an array of items belonging to the same boards', async () => {
        const { id } = sampleBoards[0];
        const response = await request(app).get(`/api/v1/boards/${id}/objects`);
        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(7);
      });
    });
  });
});

describe('POST Board endpoints', () => {
  describe('POST api/v1/boards', () => {
    test('should return the posted board', async () => {
      const response = await request(app)
        .post('/api/v1/boards')
        .send({
          name: 'new board',
        });

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual(
        {
          id: sampleBoards.length + 1,
          items: [],
          name: 'new board',
        },
      );
    });

    test('should return 400 when board name is missing', async () => {
      const response = await request(app)
        .post('/api/v1/boards')
        .send({});
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('POST api/v1/boards/:id/objects', () => {
    test('should return the posted object', async () => {
      const response = await request(app)
        .post('/api/v1/boards/1/objects')
        .send(exampleItem);

      expect(response.statusCode).toEqual(201);
    });

    test('should return 404 when board with id does not exist', async () => {
      const response = await request(app)
        .post('/api/v1/boards/6969/objects')
        .send(exampleItem);

      expect(response.statusCode).toEqual(404);
    });

    test('should return 400 when one or more required object attributes are missing {type, x, y}', async () => {
      const { x, type, ...otherProps } = exampleItem;
      const response = await request(app)
        .post('/api/v1/boards/1/objects')
        .send({ otherProps });

      expect(response.statusCode).toEqual(400);
    });

    test('should return 400 when one or more unsupported attributes are given', async () => {
      const response = await request(app)
        .post('/api/v1/boards/1/objects')
        .send({
          ...exampleItem,
          pressureClass: 'PN50', // unsupported attribute
        });

      expect(response.statusCode).toEqual(400);
    });
  });
});

describe('PATCH Board endpoints', () => {
  describe('PATCH api/v1/boards/1', () => {
    test('should return the updated board', async () => {
      const board1 = sampleBoards[0];

      const response = await request(app)
        .patch(`/api/v1/boards/${board1.id}`)
        .send({
          name: 'my board',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toEqual('my board');
    });

    test('should return 404 when a nonexistent board ID is used', async () => {
      const response = await request(app)
        .patch('/api/v1/boards/77')
        .send({
          name: 'my board',
        });
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('PATCH api/v1/boards/:id/objects/:objectId', () => {
    test('should return the updated object', async () => {
      const board1 = sampleBoards[0];
      const object1 = sampleBoards[0].items[0];

      const response = await request(app)
        .patch(`/api/v1/boards/${board1.id}/objects/${object1.id}`)
        .send({
          length: 5,
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(5);
    });

    test('should return 404 when board with id does not exist', async () => {
      const response = await request(app)
        .post('/api/v1/boards/500/objects/p1')
        .send({});

      expect(response.statusCode).toEqual(404);
    });

    test('should return 404 when the object does not exist', async () => {
      const board1 = sampleBoards[0];

      const response = await request(app)
        .patch(`/api/v1/boards/${board1.id}/objects/4000`)
        .send({});

      expect(response.statusCode).toEqual(404);
    });

    test('should return 400 when an invalid field is updated', async () => {
      const board1 = sampleBoards[0];
      const object1 = sampleBoards[0].items[0];

      const response = await request(app)
        .patch(`/api/v1/boards/${board1.id}/objects/${object1.id}`)
        .send({
          id: '4000',
        });

      expect(response.statusCode).toEqual(400);
    });

    test('should return 400 when an illegal field is updated (flange, for a pump object type)', async () => {
      const board1 = sampleBoards[0];
      const pumpObject = sampleBoards[0].items[2];

      const response = await request(app)
        .patch(`/api/v1/boards/${board1.id}/objects/${pumpObject.id}`)
        .send({
          flange: 'some-flange',
        });

      expect(response.statusCode).toEqual(400);
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
          const response = await request(app).delete(`/api/v1/boards/${board.id}/objects/${item.id}`);
          expect(response.status).toEqual(204);
          const check = await request(app).get(`/api/v1/boards/${board.id}/objects`);
          expect(check.status).toEqual(200);
          expect(check.body).toHaveLength(6);
        });
      });

      describe('given the item does not exists', () => {
        it('should return a success message', async () => {
          const board = sampleBoards[0];
          await board.items.init();
          const response = await request(app).delete(`/api/v1/boards/${board.id}/objects/4000`);
          expect(response.status).toEqual(404);
        });
      });
    });

    describe('given the board does not exist', () => {
      it('should return 404', async () => {
        const response = await request(app).delete('/api/v1/boards/4000/objects/4000');
        expect(response.status).toEqual(404);
      });
    });
  });
});
