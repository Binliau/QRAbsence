// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

let { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
