import pg from 'pg';
import { config } from '../src/config/config.js';

const { Client } = pg;

async function setupDatabase() {
  console.log(`Connecting to PostgreSQL at ${config.database.host}:${config.database.port}...`);

  const client = new Client({
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log(' Connected to PostgreSQL server.');

    const checkDbRes = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [config.database.name]
    );

    if (checkDbRes.rowCount === 0) {
      console.log(`Database '${config.database.name}' does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${config.database.name}"`);
      console.log(` Database '${config.database.name}' created successfully!`);
    } else {
      console.log(` Database '${config.database.name}' already exists.`);
    }
  } catch (error) {
    console.error(' Database setup error:', error.message);
    console.log('\nTip: Make sure PostgreSQL credentials in .env are correct and PostgreSQL service is running.');
  } finally {
    await client.end();
  }
}

setupDatabase();
