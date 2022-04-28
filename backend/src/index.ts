import express, { Express } from 'express';
import cors from 'cors';

import indexRouter from './routes/index';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`Server is listening at on port ${PORT}`);
});
