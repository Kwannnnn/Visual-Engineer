import express, { Express } from 'express';
import cors from 'cors';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PipeFitting } from './database/models';
import { indexRouter, objectsRouter } from './routes';
import 'dotenv/config';
import config from './mikro-orm.config';
import DI from './DI';

const app: Express = express();

async function setup() {
  DI.orm = await MikroORM.init(config as any);
  DI.itemRepository = DI.orm.em.getRepository(PipeFitting);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

  // Routes
  app.use('/', indexRouter);
  app.use('/api/v1/objects', objectsRouter);

  return app;
}

export default setup;
