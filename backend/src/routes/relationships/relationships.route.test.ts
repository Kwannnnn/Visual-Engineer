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

describe('PATCH /relationships/:pipelineTag', () => {
  describe('given the relationship and the item to update exists', () => {
    it('should update the second item', async () => {
      const relationship = sampleRelationships[0];
      const response = await request(app)
        .patch(`/api/v2/relationships/${relationship.pipeline.tag}`)
        .send({
          pipeline: relationship.pipeline.tag,
          secondItem: sampleBoards[0].items[2].tag,
        });
      expect(response.status).toEqual(201);
      const exrsp = {
        firstItem: relationship.firstItem.tag,
        pipeline: relationship.pipeline.tag,
        secondItem: sampleBoards[0].items[2].tag,
      };
      expect(response.body).toEqual(exrsp);
    });

    it('should update both items', async () => {
      const relationship = sampleRelationships[0];
      const response = await request(app)
        .patch(`/api/v2/relationships/${relationship.pipeline.tag}`)
        .send({
          pipeline: relationship.pipeline.tag,
          firstItem: sampleBoards[0].items[1].tag,
          secondItem: sampleBoards[0].items[2].tag,
        });
      expect(response.status).toEqual(201);
      const exrsp = {
        pipeline: relationship.pipeline.tag,
        firstItem: sampleBoards[0].items[1].tag,
        secondItem: sampleBoards[0].items[2].tag,
      };
      expect(response.body).toEqual(exrsp);
    });

    describe('given the request body contains incorrect data', () => {
      it('should not allow to an empty body', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app)
          .patch(`/api/v2/relationships/${relationship.pipeline.tag}`);
        expect(response.status).toEqual(400);
        const exrsp = {
          message: 'Mandatory fields in request body are missing',
        };
        expect(response.body).toEqual(exrsp);
      });

      it('should not allow to update an item with a pipeline', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app)
          .patch(`/api/v2/relationships/${relationship.pipeline.tag}`)
          .send({
            pipeline: relationship.pipeline.tag,
            firstItem: sampleBoards[0].items[0].tag,
          });
        expect(response.status).toEqual(400);
        const exrsp = {
          message: 'Connected item cannot be a pipe item',
        };
        expect(response.body).toEqual(exrsp);
      });

      it('should not allow to update when the pipeline is not defined in the body', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app)
          .patch(`/api/v2/relationships/${relationship.pipeline.tag}`)
          .send({
            firstItem: sampleBoards[0].items[0].tag,
          });
        expect(response.status).toEqual(400);
        const exrsp = {
          message: 'Pipeline tag in request body does not match',
        };
        expect(response.body).toEqual(exrsp);
      });

      it('should not allow to update when the pipeline in the body is not the same as in the parameter', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app)
          .patch(`/api/v2/relationships/${relationship.pipeline.tag}`)
          .send({
            pipeline: '000-000-000',
          });
        expect(response.status).toEqual(400);
        const exrsp = {
          message: 'Pipeline tag in request body does not match',
        };
        expect(response.body).toEqual(exrsp);
      });

      it('should not allow to update when the two items to update are the same', async () => {
        const relationship = sampleRelationships[0];
        const response = await request(app)
          .patch(`/api/v2/relationships/${relationship.pipeline.tag}`)
          .send({
            pipeline: relationship.pipeline.tag,
            firstItem: sampleBoards[0].items[1].tag,
            secondItem: sampleBoards[0].items[1].tag,
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
          .patch(`/api/v2/relationships/${relationship.pipeline.tag}`)
          .send({
            pipeline: relationship.pipeline.tag,
            firstItem: '000-000-000',
          });
        expect(response.status).toEqual(404);
        const exrsp = {
          message: 'Item by tag not found',
        };
        expect(response.body).toEqual(exrsp);
      });
    });
  });
});

describe('given the relationship does not exist', () => {
  it('should return 404', async () => {
    const response = await request(app).get('/api/v2/relationships/4000');
    expect(response.status).toEqual(404);
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
      expect(check.body).toHaveLength(2);
    });
  });

  describe('given the relationship does not exist', () => {
    it('should return 404', async () => {
      const response = await request(app).delete('/api/v2/relationships/4000');
      expect(response.status).toEqual(404);
    });
  });
});
