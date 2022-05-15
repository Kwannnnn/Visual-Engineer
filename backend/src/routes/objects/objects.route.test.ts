import request from 'supertest';
// import { Server } from 'http';
import setup from '../../index';
import DI from '../../DI';

// let httpServer: Server;
let app: Express.Application;

beforeEach(async () => {
  app = await setup();
});

afterEach(() => {
  DI.orm.close();
});

describe('/objects', () => {
  describe('GET /objects', () => {
    it('should return a list of all existing objects', async () => {
      const response = await request(app).get('/api/v1/objects');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /objects/:tag', () => {
    describe('given the object does exist', () => {
      it('should return an existing object', async () => {
        // TODO: update this test whenever database is seeded
        expect(true).toBe(true);
      });
    });

    describe('given the object does not exist', () => {
      it('should return 404', async () => {
        const response = await request(app).get('/api/v1/objects/3737');
        expect(response.status).toEqual(404);
      });
    });
  });
});
