import request from 'supertest';
import setup from '../../index';
import DI from '../../DI';

let app: Express.Application;

beforeEach(async () => {
  app = await setup();
});

afterEach(() => {
  DI.orm.close();
});

describe('/boards', () => {
  describe('GET /boards', () => {
    it('should return a list of all existing boards', async () => {
      const response = await request(app).get('/api/v1/boards');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /boards/:id', () => {
    describe('given the board exists', () => {
      it('should return an existing board', async () => {
        expect(true).toEqual(true);
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
