import Router from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { pool } from '../models/poolConnection';

const loginRouter = Router();

type User = {
	id: number;
	username: string;
	email: string;
	password: string;
};

type RequestUser = Request & { user: User };

const authenticateJWT = (req: RequestUser, res: Response, next: Function) => {
   const token = req.headers.authorization?.split(' ')[1];

   if (!token) {
      return res.status(403).json({ message: 'Токен не предоставлен' });
   }

   jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
         return res.status(403).json({ message: 'Неверный токен' });
      }

      req.user = user as User;
      next();
   });
};

loginRouter.post('/',   async (req: Request, res: Response) => {
   const { email, password } = req.body;

   try {
      // Поиск пользователя по username
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [email];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
         return res.status(401).json({ message: 'Пользователь не найден' });
      }

      const user = result.rows[0];

      // Проверка пароля
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({ message: 'Неверный пароль' });
      }

      // Создание JWT токена
      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET!, {
         expiresIn: '1h',
      });

      res.json({ message: 'Успешный вход', token });
   } catch (err) {
      console.log(err);

      console.error('Ошибка при логинизации:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
   }
   //    if (!email || !password) {
   //       return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
   //    }

   //    try {
   //       const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
   //       const existingUserResult = await pool.query(existingUserQuery, [email]);

   //       if (existingUserResult.rows.length > 0) {
   //          return res.status(400).json({ message: 'Пользователь уже существует' });
   //       }

   //       const salt = await bcrypt.genSalt(10);
   //       const hashedPassword = await bcrypt.hash(password, salt);

   //       const newUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
   //       const newUserResult = await pool.query(newUserQuery, [username, email, hashedPassword]);

   //       res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUserResult.rows[0] });
   //    } catch (error) {
   //       console.error(error);
   //       res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
   //    }
});

export default loginRouter;
