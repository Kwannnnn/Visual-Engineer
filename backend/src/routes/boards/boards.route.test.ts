import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import setup from '../../index';
import DI from '../../DI';

let app: Express.Application;

const exampleItem = {
  tag: uuidv4(),
  name: 'Cleaner',
  length: 2.52,
  width: 2.35,
  depth: 1.47,
  diameter: 1.79,
  emptyMass: 69,
  head: 1,
  filledMass: 5.4,
  netVolume: 12.3,
  grossVolume: 23.7,
  preliminaryPower: 454,
  finalPower: 600,
  type: 'pump',
};

beforeEach(async () => {
  app = await setup();
});

afterEach(() => {
  exampleItem.tag = uuidv4(); // generate unique tag for item after each test
  DI.orm.close();
});

// TODO: Drop and then update the database before running the test
// TODO: since the database is not seeded yet

describe('GET Board endpoints', () => {
  describe('GET api/v1/boards', () => {
    test('should return all boards', async () => {
      const response = await request(app).get('/api/v1/boards');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET api/v1/boards/:tag', () => {
    test('should return an existing board', async () => {
      // TODO: update this test whenever database is seeded
      expect(true);
    });

    test('should return 404 when a board with id does not exist', async () => {
      const response = await request(app).get('/api/v1/boards/6969');
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('GET api/v1/boards/:tag/objects', () => {
    test('should return an existing board', async () => {
      // TODO: update this test whenever database is seeded
      // const response = await request(app).get('/api/v1/boards/1/objects');
      expect(true);
    });
  });
});

describe('POST Board endpoints', () => {
  describe('POST api/v1/boards', () => {
    test('should return the posted board', async () => {
      const response = await request(app)
        .post('/api/v1/boards')
        .send({
          name: 'new board',
        });

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual(
        {
          id: 1,
          items: [],
          name: 'new board',
        },
      );
    });

    test('should return 400 when board name is missing', async () => {
      const response = await request(app)
        .post('/api/v1/boards')
        .send({});
      expect(response.statusCode).toEqual(400);
    });
  });

  // TODO: the tests below are not finished
  describe('POST api/v1/boards/:id/objects', () => {
    test('should return the posted object', async () => {
      const response = await request(app)
        .post('/api/v1/boards/1/objects')
        .send(exampleItem);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        ...exampleItem,
        board: {
          id: 1,
          name: 'new board',
        },
      });
    });

    test('should return 404 when board with id does not exist', async () => {
      const response = await request(app)
        .post('/api/v1/boards/6969/objects')
        .send(exampleItem);

      expect(response.statusCode).toEqual(404);
    });

    test('should return 400 when one or more object attributes are missing', async () => {
      const response = await request(app)
        .post('/api/v1/boards/1/objects')
        .send({
          tag: exampleItem.tag,
          name: 'Cleaner',
          // length: 2.52,
          // width: 2.35,
          depth: 1.47,
          diameter: 1.79,
          emptyMass: 69,
          head: 1,
          filledMass: 5.4,
          netVolume: 12.3,
          grossVolume: 23.7,
          preliminaryPower: 454,
          finalPower: 600,
          type: 'pump',
        });

      expect(response.statusCode).toEqual(400);
    });
  });
});

describe('PATCH Board endpoints', () => {
  describe('PATCH api/v1/boards/1', () => {
    test('should return the updated board', async () => {
      // FIXME: This request is just here to create a board
      await request(app)
        .post('/api/v1/boards')
        .send({
          name: 'board1',
        });

      const response = await request(app)
        .patch('/api/v1/boards/2')
        .send({
          name: 'my board',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        {
          id: 2,
          name: 'my board',
        },
      );
    });

    test('should return 404 when a nonexistent board ID is used', async () => {
      const response = await request(app)
        .patch('/api/v1/boards/77')
        .send({
        });
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('PATCH api/v1/boards/:id/objects/:objectId', () => {
    test('should return the updated object', async () => {
      // FIXME: This request is just here to create an item in the board
      await request(app)
        .post('/api/v1/boards/2/objects')
        .send({
          ...exampleItem,
          tag: 'p1',
        });

      const response = await request(app)
        .patch('/api/v1/boards/2/objects/p1')
        .send({
          length: 5,
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        {
          ...exampleItem,
          tag: 'p1',
          length: 5,
          board: 2,
        },
      );
    });

    test('should return 404 when board with id does not exist', async () => {
      const response = await request(app)
        .post('/api/v1/boards/500/objects/p1')
        .send({});

      expect(response.statusCode).toEqual(404);
    });

    test('should return 404 when the object does not exist', async () => {
      const response = await request(app)
        .post('/api/v1/boards/2/objects/sometag')
        .send({});

      expect(response.statusCode).toEqual(404);
    });

    test('should return 400 when an invalid field is updated', async () => {
      const response = await request(app)
        .patch('/api/v1/boards/2/objects/p1')
        .send({
          tag: 'new-p1-tag',
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        {
          errors: [
            {
              msg: 'Illegal field',
              param: 'tag',
              location: 'body',
            },
          ],
        },
      );
    });

    test('should return 400 when an illegal field is updated (for a pump object type)', async () => {
      const response = await request(app)
        .patch('/api/v1/boards/2/objects/p1')
        .send({
          flange: 'some-flange',
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        {
          errors: [
            {
              msg: 'Illegal field',
              param: 'flange',
              location: 'body',
            },
          ],
        },
      );
    });
  });
});
