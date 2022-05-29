import debug from 'debug';
import winston from 'winston';
import expressWinston from 'express-winston';
import setup from './index';

const dbg: debug.Debugger = debug('http');
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

setup().then((app) => {
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
});
