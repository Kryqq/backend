import express from 'express';
import bodyParser from 'body-parser';
import registerRouter from './routes/registerRouter.js';
import testRouter from './routes/testRouter.js';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/test', testRouter);
app.use('/register', registerRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

// Добавить типизацию
// переписать с bcypt на jsonwebtokens
// реализовать аутентификацию пользователя
