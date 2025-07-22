import express from 'express';
import pool from './db.js';

const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM account');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
