import pg from 'pg';

 export const pool = new pg.Pool({
   user: 'admin',
   password: 'root',
   host: 'localhost',
   database: 'postgres',
   port: 5432,
});

 