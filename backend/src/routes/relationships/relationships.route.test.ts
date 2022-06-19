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

  describe('GET /relationships/:pipelineId', () => {
    describe('given the relationship exists', () => {
      it('should return an existing relationship', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app).get(`/api/v2/relationships/${relationship.pipeline.id}`);
        expect(response.status).toEqual(200);
        const exrsp = {
          firstItem: relationship.firstItem.id,
          pipeline: relationship.pipeline.id,
          secondItem: relationship.secondItem.id,
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
      const pipeline = sampleBoards[0].items[4].id;
      const firstItem = sampleBoards[0].items[6].id;
      const secondItem = sampleBoards[0].items[5].id;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          firstItem,
          secondItem,
        });

      expect(response.statusCode).toEqual(201);
    });

    test('should return 400 when the pipeline ID is missing', async () => {
      const firstItem = sampleBoards[0].items[3].id;
      const secondItem = sampleBoards[0].items[5].id;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          firstItem,
          secondItem,
        });
      expect(response.statusCode).toEqual(400);
    });

    test('should return 400 when one or both of the to-be-connected items are missing', async () => {
      const pipeline = sampleBoards[0].items[4].id;
      const secondItem = sampleBoards[0].items[5].id;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          secondItem,
        });
      expect(response.statusCode).toEqual(400);
    });

    test('should return 404 when one of the provided items does not exist', async () => {
      const pipeline = sampleBoards[0].items[4].id;
      const secondItem = sampleBoards[0].items[5].id;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          firstItem: '4000',
          secondItem,
        });
      expect(response.statusCode).toEqual(404);
    });

    test('should return 400 when the provided pipeline is not an item of type Pipeline', async () => {
      const pipeline = sampleBoards[0].items[1].id;
      const firstItem = sampleBoards[0].items[5].id;
      const secondItem = sampleBoards[0].items[3].id;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          firstItem,
          secondItem,
        });
      expect(response.statusCode).toEqual(400);
    });

    test('should return 400 when the two items to be connected are the same', async () => {
      const pipeline = sampleBoards[0].items[4].id;
      const firstItem = sampleBoards[0].items[2].id;
      const secondItem = sampleBoards[0].items[2].id;

      const response = await request(app)
        .post('/api/v2/relationships')
        .send({
          pipeline,
          firstItem,
          secondItem,
        });
      expect(response.statusCode).toEqual(400);
    });

    test('should return 400 when one or both the two items to be connected are of type Pipeline', async () => {
      const pipeline = sampleBoards[0].items[4].id;
      const firstItem = sampleBoards[0].items[4].id;
      const secondItem = sampleBoards[0].items[2].id;

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

describe('PATCH /relationships/:pipelineId', () => {
  describe('given the relationship and the item to update exists', () => {
    it('should update the second item', async () => {
      const relationship = sampleRelationships[0];
      const response = await request(app)
        .patch(`/api/v2/relationships/${relationship.pipeline.id}`)
        .send({
          pipeline: relationship.pipeline.id,
          firstItem: relationship.firstItem.id,
          secondItem: sampleBoards[0].items[2].id,
        });
      expect(response.status).toEqual(201);
      const exrsp = {
        pipeline: relationship.pipeline.id,
        firstItem: relationship.firstItem.id,
        secondItem: sampleBoards[0].items[2].id,
      };
      expect(response.body).toEqual(exrsp);
    });

    it('should update both items', async () => {
      const relationship = sampleRelationships[0];
      const response = await request(app)
        .patch(`/api/v2/relationships/${relationship.pipeline.id}`)
        .send({
          pipeline: relationship.pipeline.id,
          firstItem: sampleBoards[0].items[2].id,
          secondItem: sampleBoards[0].items[6].id,
        });
      expect(response.status).toEqual(201);
      const exrsp = {
        pipeline: relationship.pipeline.id,
        firstItem: sampleBoards[0].items[2].id,
        secondItem: sampleBoards[0].items[6].id,
      };
      expect(response.body).toEqual(exrsp);
    });

    describe('given the request body contains incorrect data', () => {
      it('should not allow to an empty body', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app)
          .patch(`/api/v2/relationships/${relationship.pipeline.id}`);
        expect(response.status).toEqual(400);
        const exrsp = {
          message: 'Mandatory fields in request body are missing',
        };
        expect(response.body).toEqual(exrsp);
      });

      it('should not allow to update an item with a pipeline', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app)
          .patch(`/api/v2/relationships/${relationship.pipeline.id}`)
          .send({
            pipeline: relationship.pipeline.id,
            firstItem: sampleBoards[0].items[0].id,
            secondItem: relationship.secondItem.id,
          });
        expect(response.status).toEqual(400);
        const exrsp = {
          message: 'Cannot connect a pipeline to a pipeline',
        };
        expect(response.body).toEqual(exrsp);
      });

      it('should not allow to update when the two items to update are the same', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app)
          .patch(`/api/v2/relationships/${relationship.pipeline.id}`)
          .send({
            pipeline: relationship.pipeline.id,
            firstItem: sampleBoards[0].items[1].id,
            secondItem: sampleBoards[0].items[1].id,
          });
        expect(response.status).toEqual(400);
        const exrsp = {
          message: 'First and second item cannot be the same',
        };
        expect(response.body).toEqual(exrsp);
      });

      it('should not allow to update when the item to update to does not exist', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app)
          .patch(`/api/v2/relationships/${relationship.pipeline.id}`)
          .send({
            pipeline: relationship.pipeline.id,
            firstItem: '4000',
          });
        expect(response.status).toEqual(404);
        const exrsp = {
          message: 'Item not found',
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

describe('DELETE /relationships/:pipelineId', () => {
  describe('given the relationship exists', () => {
    it('should return 204 and the other items should still exist', async () => {
      const relationship = sampleRelationships[0];
      const response = await request(app).delete(`/api/v2/relationships/${relationship.pipeline.id}`);
      expect(response.status).toEqual(204);
      const { id } = sampleBoards[0];
      const check = await request(app).get(`/api/v1/boards/${id}/objects`);
      expect(check.status).toEqual(200);
      expect(check.body).toHaveLength(6);
    });
  });

  describe('given the relationship does not exist', () => {
    it('should return 404', async () => {
      const response = await request(app).delete('/api/v2/relationships/4000');
      expect(response.status).toEqual(404);
    });
  });
});
