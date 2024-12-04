import pg from 'pg';

const { Client } = pg;
const client = new Client({
  user: 'postgres',
  password: 'pass',
  database: 'city_employee_tracker_db'
});

await client.connect();

export default client;