import express, { Express } from 'express';
import cors from 'cors';
import winston from 'winston';
import expressWinston from 'express-winston';
import debug from 'debug';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import indexRouter from './routes/index';
import 'dotenv/config';
import config from './mikro-orm.config';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

// eslint-disable-next-line
export let orm: MikroORM; // Use this ORM instance to interact with the database

const setup = async () => {
  orm = await MikroORM.init(config as any);
  const dbg = debug('http');

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });

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

  // Routes
  app.use('/', indexRouter);

  app.listen(PORT, () => {
    dbg(`Server is listening at on port ${PORT}`);
  });
};

setup();
