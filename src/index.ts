import expressModule from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import testRouter from './routes/testRouter';
import registerRouter from './routes/registerRouter';


const app = expressModule();


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/test', testRouter);
app.use('/register', registerRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));


function express() {
	throw new Error('Function not implemented.');
}
// Добавить типизацию
// переписать с bcypt на jsonwebtokens
// реализовать аутентификацию пользователя
