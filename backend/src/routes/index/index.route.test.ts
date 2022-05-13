import { Server } from 'http';
import request from 'supertest';
import { server, setup } from '../../index';
import DI from '../../DI';

let app: Server;

beforeEach(async () => {
  await setup;
  app = server;
});

afterEach((done) => {
  app.close(done);
});

afterEach(async () => {
  await DI.orm.close();
});

describe('GET /', () => {
  test('should respond with the name of the API', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Visual Engineer API');
  });
});
