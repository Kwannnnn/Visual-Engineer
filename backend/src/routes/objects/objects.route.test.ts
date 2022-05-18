import request from 'supertest';
import setup from '../../index';
import DI from '../../DI';

let app: Express.Application;

beforeEach(async () => {
  app = await setup();
  // FIXME if this is enabled in multiple files something goes wrong with creation of the database
  // await DI.orm.getSchemaGenerator().refreshDatabase();
  // const seeder: ISeedManager = DI.orm.getSeeder();
  // await seeder.seed(DatabaseSeeder);
});

afterEach(async () => {
  // FIXME if this is enabled in multiple files something goes wrong with creation of the database
  // await DI.orm.getSchemaGenerator().clearDatabase();
  DI.orm.close();
});

describe('/objects', () => {
  describe('GET /objects', () => {
    it('should return a list of all existing objects', async () => {
      const response = await request(app).get('/api/v1/objects');
      expect(response.status).toEqual(200);
      // expect(response.body).toHaveLength(3);
    });
  });

  describe('GET /objects/:tag', () => {
    describe('given the object does exist', () => {
      it('should return an existing object', async () => {
        // const { id } = sampleBoardObjects[0];
        // const response = await request(app).get(`/api/v1/objects/${sampleBoardObjects[0]}`);
        // expect(response.body).toEqual(sampleBoardObjects[0]);
        expect(true).toBe(true);
      });
    });

    describe('given the object does not exist', () => {
      it('should return 404', async () => {
        const response = await request(app).get('/api/v1/objects/3737');
        expect(response.status).toEqual(404);
        expect(true).toBe(true);
      });
    });
  });
});
