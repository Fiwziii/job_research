import express, { Request, Response } from 'express';
import usersController from './context/controllers/user.controller';
import 'module-alias/register';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/test',usersController);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});