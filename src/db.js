import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'noderive',
  host: 'database',
  database: 'noderive',
  password: 'noderive',
  port: 5432,
});

export default pool;

