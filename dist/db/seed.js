import pg from 'pg';
import { promises as fs } from 'fs';
const { Client } = pg;
const client = new Client({
    user: 'postgres',
    password: 'pass',
    database: 'employee_tracker_db'
});
await client.connect();
try {
    const tableSchema = await fs.readFile('./dist/db/schema.sql', 'utf8');
    const seedSchema = await fs.readFile('./dist/db/seed.sql', 'utf8');
    await client.query(tableSchema);
    console.log('Tables created');
    await client.query(seedSchema);
    await client.end();
    console.log('Tables seeded');
}
catch (error) {
    console.log('Schema error', error);
}
//# sourceMappingURL=seed.js.map