import { response } from 'express';
import { Server } from 'http';
import request from 'supertest';
import { server, setup, DI } from '../index';

let app: Server;

beforeEach(async () => {
  await setup;
  app = server;
});

afterEach(() => {
  app.close();
  DI.orm.close();
});

describe('GET Board endpoints', () => {
  describe('GET api/v1/boards', () => {
    test('should return all boards', async () => {
      const response = await request(app).get('/api/v1/boards');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET api/v1/boards/:tag', () => {
    test('should return an existing board', async () => {
      // TODO: update this test whenever database is seeded
      expect(true);
    });

    test('should return 404 when a board with id does not exist', async () => {
      const response = await request(app).get('/api/v1/boards/6969');
      
      expect(response.statusCode).toEqual(404);
    });
  });
});

describe('POST Board endpoints', () => {
  describe('POST api/v1/boards', () => {
    test('should return the posted board', async () => {
      const response = await request(app)
        .post('/api/v1/boards')
        .send({
          name: 'new board'
        });

      expect(response.statusCode).toEqual(201);
    });

    test('should return 400 when board name is missing', async () => {
      const response = await request(app)
        .post('/api/v1/boards')
        .send({});
        
      expect(response.statusCode).toEqual(400);
    });
  });

  //TODO: the tests below are not finished
  describe('POST api/v1/boards/:id/items', () => {
    test('should return the posted board', async () => {

      // first post a board
      const firstResponse = await request(app)
        .post('/api/v1/boards')
        .send({
          name: 'new board'
        });

      // get id of the new board
      const id: number = firstResponse.body.id;

      // const response = await request(app)
      //   .post(`/api/v1/boards/${id}/items`)
      //   .send({

      //   });

      expect(true);
    });

    test('should return 404 when board with id does not exist', async () => {
      // const response = await request(app)
      //   .post('/api/v1/boards/6969/items')
      //   .send({

      //   });

      expect(true);
    });

    test('should return 400 when one or more item attributes are missing', async () => {
      // const response = await request(app)
      //   .post('/api/v1/boards/1/items')
      //   .send({

      //   });

      expect(true);
    });
  });
})
