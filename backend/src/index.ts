import 'reflect-metadata';
import express, { Express, Router } from 'express';
import cors from 'cors';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Item, Board, Relationship } from './database/models';
import {
  indexRouter, objectsRouterV1, boardRouter, objectsRouterV2, relationshipRouter,
} from './routes';
import 'dotenv/config';
import config from './mikro-orm.config';
import DI from './DI';

const app: Express = express();

async function setup() {
  DI.orm = await MikroORM.init(config as any);
  DI.em = DI.orm.em;

  DI.itemRepository = DI.orm.em.getRepository(Item);
  DI.boardRepository = DI.orm.em.getRepository(Board);
  DI.relationshipRepository = DI.orm.em.getRepository(Relationship);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

  // Routes
  app.use('/', indexRouter);

  const v1 = Router();
  const v2 = Router();

  v2.use('/objects', objectsRouterV2);
  v2.use('/relationships', relationshipRouter);
  v2.use('/objects', objectsRouterV1);

  v1.use('/objects', objectsRouterV1);
  v1.use('/boards', boardRouter);

  app.use('/api/v1', v1);
  app.use('/api/v2', v2);

  return app;
}

export default setup;
