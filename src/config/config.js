import dotenv from 'dotenv';

dotenv.config();

const readPort = (value, fallback, name) => {
  const parsed = Number(value || fallback);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`${name} must be an integer between 1 and 65535.`);
  }
  return parsed;
};

const databaseName = process.env.DB_NAME || 'task_management_db';
if (!databaseName.trim()) {
  throw new Error('DB_NAME cannot be empty.');
}

export const config = {
  port: readPort(process.env.PORT, 3000, 'PORT'),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: readPort(process.env.DB_PORT, 5432, 'DB_PORT'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: databaseName,
  },
};
