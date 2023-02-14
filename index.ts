import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv'
import { DataSource } from 'typeorm';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  synchronize: true,
});
const app: Express = express();

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

