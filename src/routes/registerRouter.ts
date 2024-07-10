import Router from 'express';
import bcrypt from 'bcryptjs';

import { pool } from '../models/poolConnection';
import { Request, Response } from 'express';

const registerRouter = Router();

registerRouter.post('/', async (req: Request, res: Response) => {
   const { username, email, password, PasswordConfirm } = req.body;

   if (!username || !email || !password || !PasswordConfirm) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
   }

   if (password !== PasswordConfirm) {
      return res.status(400).json({ message: 'Пароли не совпадают' });
   }

   try {
      const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
      const existingUserResult = await pool.query(existingUserQuery, [email]);

      if (existingUserResult.rows.length > 0) {
         return res.status(400).json({ message: 'Пользователь уже существует' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
      const newUserResult = await pool.query(newUserQuery, [username, email, hashedPassword]);

      res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUserResult.rows[0] });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
   }
});

export default registerRouter;
