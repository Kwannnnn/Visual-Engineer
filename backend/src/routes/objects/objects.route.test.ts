import request from 'supertest';
import { Server } from 'http';
import { server, setup } from '../../index';
import DI from '../../DI';

let httpServer: Server;
let app: Express.Application;

beforeEach(async () => {
  app = await setup;
  httpServer = server;
});

afterEach((done) => {
  DI.orm.close().then(() => {
    httpServer.close(() => done());
  });
});

describe('GET endpoints', () => {
  // FIXME: Fix this test
  // describe('GET api/v1/objects', () => {
  //   test('should return all objects', async () => {
  //     const response = await request(app).get('/api/v1/objects');
  //     expect(response.status).toEqual(200);
  //     expect(response.body).toEqual([]);
  //   });
  // });

  describe('GET api/v1/objects/:tag', () => {
    test('should return an existing object', async () => {
      // TODO: update this test whenever database is seeded
      expect(true);
    });

    test('should return 404 when object with tag does not exist', async () => {
      const response = await request(app).get('/api/v1/objects/3737');
      expect(response.status).toEqual(404);
    });
  });
});
