import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv'
import { DataSource } from 'typeorm';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Task } from './src/tasks/tasks.entity';

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());

app.use(cors());

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [Task],
  synchronize: true,
});

const PORT = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ GET: 'Hello, Server is running...' });
});

AppDataSource.initialize()
  .then(() => {
    // app.listen(PORT)
    app.listen(PORT, () => {
      console.log('MySQL is connected, & Server is running on PORT: ', PORT);
    });
  })
  .catch((err) => console.log(err));

