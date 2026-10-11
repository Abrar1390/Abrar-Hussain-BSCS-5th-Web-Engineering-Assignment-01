import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../../config/config.js';
import { TaskSchema } from '../../domain/entities/Task.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: true,
  logging: config.nodeEnv === 'development',
  entities: [TaskSchema],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log(' PostgreSQL Database connected successfully via TypeORM.');
    }
    return AppDataSource;
  } catch (error) {
    console.error(' Error during TypeORM Data Source initialization:', error.message);
    throw error;
  }
};
