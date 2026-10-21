import { Client } from 'pg';
import { config } from '../src/config/config.js';

const quoteIdentifier = (value) => `"${value.replaceAll('"', '""')}"`;

async function setupDatabase() {
  const client = new Client({
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: 'postgres',
  });

  let connected = false;
  try {
    console.log(`Connecting to PostgreSQL at ${config.database.host}:${config.database.port}...`);
    await client.connect();
    connected = true;
    console.log('Connected to PostgreSQL server.');

    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [config.database.name]
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${quoteIdentifier(config.database.name)}`);
      console.log(`Database '${config.database.name}' created successfully.`);
    } else {
      console.log(`Database '${config.database.name}' already exists.`);
    }
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (connected) {
      try {
        await client.end();
      } catch (error) {
        console.error('Failed to close the PostgreSQL connection:', error.message);
        process.exitCode = 1;
      }
    }
  }
}

await setupDatabase();
