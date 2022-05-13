import { Server } from 'http';
import request from 'supertest';
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

describe('GET /', () => {
  test('should respond with the name of the API', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Visual Engineer API');
  });
});
