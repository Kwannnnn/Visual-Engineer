import request from 'supertest';
import { ISeedManager } from '@mikro-orm/core';
import setup from '../../index';
import DI from '../../DI';
import DatabaseSeeder from '../../database/seeders/DatabaseSeeder';
import { sampleRelationships } from '../../database/seeders/RelationshipSeeder';
import { sampleBoards } from '../../database/seeders/BoardSeeder';

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

describe('POST Relationship endpoints', () => {
  describe('POST api/v2/relationships', () => {
    test('should return the posted relationship', async () => {
      const pipeline = sampleBoards[0].items[4].tag;
      const firstItem = sampleBoards[0].items[3].tag;
      const secondItem = sampleBoards[0].items[5].tag;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          firstItem,
          secondItem,
        });

      expect(response.statusCode).toEqual(201);
    });

    test('should return 400 when the pipeline tag is missing', async () => {
      const firstItem = sampleBoards[0].items[3].tag;
      const secondItem = sampleBoards[0].items[5].tag;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          firstItem,
          secondItem,
        });
      expect(response.statusCode).toEqual(400);
    });

    test('should return 400 when one or both of the to-be-connected items are missing', async () => {
      const pipeline = sampleBoards[0].items[4].tag;
      const secondItem = sampleBoards[0].items[5].tag;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          secondItem,
        });
      expect(response.statusCode).toEqual(400);
    });

    test('should return 404 when one of the provided items does not exist', async () => {
      const pipeline = sampleBoards[0].items[4].tag;
      const secondItem = sampleBoards[0].items[5].tag;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          firstItem: '122-12sa-gi2',
          secondItem,
        });
      expect(response.statusCode).toEqual(400);
    });

    test('should return 400 when the provided pipeline is not an item of type Pipeline', async () => {
      const pipeline = sampleBoards[0].items[1].tag;
      const firstItem = sampleBoards[0].items[5].tag;
      const secondItem = sampleBoards[0].items[3].tag;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          firstItem,
          secondItem,
        });
      expect(response.statusCode).toEqual(400);
    });

    test('should return 400 when the provided items cannot be associated', async () => {
      const pipeline = sampleBoards[0].items[4].tag;
      const firstItem = sampleBoards[0].items[2].tag;
      const secondItem = sampleBoards[0].items[5].tag;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          firstItem,
          secondItem,
        });
      expect(response.statusCode).toEqual(400);
    });
  });
});

describe('DELETE /relationships/:pipelineTag', () => {
  describe('given the relationship exists', () => {
    it('should return 204 and the other items should still exist', async () => {
      const relationship = sampleRelationships[0];
      const response = await request(app).delete(`/api/v2/relationships/${relationship.pipeline.tag}`);
      expect(response.status).toEqual(204);
      const { id } = sampleBoards[0];
      const check = await request(app).get(`/api/v1/boards/${id}/objects`);
      expect(check.status).toEqual(200);
      expect(check.body).toHaveLength(5);
    });
  });

  describe('given the relationship does not exist', () => {
    it('should return 404', async () => {
      const response = await request(app).delete('/api/v2/relationships/4000');
      expect(response.status).toEqual(404);
    });
  });
});
