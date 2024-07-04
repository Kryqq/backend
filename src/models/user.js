import pg from 'pg';

const newUser = async (name, surname) => {
   try {
      const client = new pg.Client({
         user: 'admin',
         password: 'root',
         host: 'localhost',
         database: 'postgres',
         port: 5432,
      });
      await client.connect();
      const query = 'INSERT INTO person (name, surname) VALUES ($1, $2) RETURNING userID';
      const values = [name, surname];
      const result = await client.query(query, values);
      const userId = result.rows[0].id;
      console.log(`Новый пользователь был успешно добавлен с id ${userId}`);
      return userId;
   } catch (err) {
      console.error('Ошибка при добавлении пользователя:', err);
      throw err;
   }
};



export default newUser;
