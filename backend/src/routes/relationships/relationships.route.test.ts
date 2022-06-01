import request from 'supertest';
import { ISeedManager } from '@mikro-orm/core';
import setup from '../../index';
import DI from '../../DI';
import DatabaseSeeder from '../../database/seeders/DatabaseSeeder';

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

// describe('GET Relationship endpoints', () => {
//   describe('GET api/v2/relationships', () => {
//     test('should return all relationships', async () => {
//       const response = await request(app).get('/api/v2/relationships');
//       expect(response.status).toEqual(200);
//       expect(response.body).toHaveLength(3);
//     });
//   });

//   describe('GET /relationships/:pipelineTag', () => {
//     describe('given the relationship exists', () => {
//       it('should return an existing relationship', async () => {
//         const { pipeline, firstItem, secondItem } = sampleRelationships[0];
//         const response = await request(app).get(`/api/v2/relationships/${pipeline}`);
//         expect(response.status).toEqual(200);
//         expect(response.body).toEqual({ pipeline, firstItem, secondItem });
//       });
//     });
//   });
// });

describe('DELETE /relationships/:pipelineTag', () => {
  // describe('given the relationship exists', () => {
  //   it('should return 204', async () => {
  //     const relationship = sampleRelationships[0];
  //     const response = await request(app).delete(`/api/v1/boards/${relationship.pipeline}`);
  //     expect(response.status).toEqual(204);
  //   });
  // });

  describe('given the relationship does not exist', () => {
    it('should return 404', async () => {
      const response = await request(app).delete('/api/v1/relationship/4000');
      expect(response.status).toEqual(404);
    });
  });
});
