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

describe('GET /', () => {
  test('should respond with the name of the API', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Visual Engineer API');
  });
});
