import express, { Request, Response } from 'express';
import usersController from './context/controllers/user.controller';
import fileController from './context/controllers/file.controller';
import fileUpload from 'express-fileupload';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3001;

app.use(cors(
  {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use('/storage', express.static('storage'))

app.use('/api/auth', usersController);
app.use('/api/file', fileController);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});