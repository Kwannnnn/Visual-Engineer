import request from 'supertest';
import { ISeedManager } from '@mikro-orm/core';
import setup from '../../index';
import DI from '../../DI';
import DatabaseSeeder from '../../database/seeders/DatabaseSeeder';
import { sampleRelationships } from '../../database/seeders/RelationshipSeeder';

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

describe('GET Relationship endpoints', () => {
  describe('GET api/v2/relationships', () => {
    test('should return all relationships', async () => {
      const response = await request(app).get('/api/v2/relationships');
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /relationships/:pipelineTag', () => {
    describe('given the relationship exists', () => {
      it('should return an existing relationship', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app).get(`/api/v2/relationships/${relationship.pipeline.tag}`);
        expect(response.status).toEqual(200);
        const exrsp = {
          firstItem: relationship.firstItem.tag,
          pipeline: relationship.pipeline.tag,
          secondItem: relationship.secondItem.tag,
        };
        expect(response.body).toEqual(exrsp);
      });
    });

    describe('given the relationship does not exist', () => {
      it('should return 404', async () => {
        const response = await request(app).get('/api/v2/relationships/4000');
        expect(response.status).toEqual(404);
      });
    });
  });
});

describe('DELETE /relationships/:pipelineTag', () => {
  describe('given the relationship exists', () => {
    it('should return 204', async () => {
      const relationship = sampleRelationships[0];
      const response = await request(app).delete(`/api/v2/relationships/${relationship.pipeline.tag}`);
      expect(response.status).toEqual(204);
    });
  });

  describe('given the relationship does not exist', () => {
    it('should return 404', async () => {
      const response = await request(app).delete('/api/v2/relationships/4000');
      expect(response.status).toEqual(404);
    });
  });
});
