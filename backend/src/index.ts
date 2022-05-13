import express, { Express } from 'express';
import cors from 'cors';
import winston from 'winston';
import expressWinston from 'express-winston';
import debug from 'debug';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';
import { indexRouter, boardsRouter } from './routes';
import 'dotenv/config';
import config from './mikro-orm.config';
import { Item } from './database/models/Item';
import { Board } from './database/models/Board';

const dbg: debug.Debugger = debug('http');
const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

// eslint-disable-next-line
export const DI = {} as {
  orm: MikroORM,
  // itemRepository: EntityRepository<Item>,
  em: EntityManager,
  boardRepository: EntityRepository<Board>,
}; // Use this ORM instance to interact with the database

export const setup = (async () => {
  DI.orm = await MikroORM.init(config as any);
  DI.em = DI.orm.em;
  // DI.itemRepository = DI.orm.em.getRepository(Item);
  DI.boardRepository = DI.orm.em.getRepository(Board);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

  // Routes
  app.use('/', indexRouter);

  // FIXME
  // app.use('/api/v1/objects', objectsRouter); 
  app.use('/api/v1/boards', boardsRouter); 

  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console(),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
    meta: false,
    msg: 'HTTP {{req.method}} {{req.url}}',
    // expressFormat: true,
    // colorize: true,
  }));

  app.listen(PORT, () => {
    dbg(`Server is listening at on port ${PORT}`);
  });
})();
