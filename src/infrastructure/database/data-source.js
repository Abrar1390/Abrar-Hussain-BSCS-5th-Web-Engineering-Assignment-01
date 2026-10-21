import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../../config/config.js';
import { TaskSchema } from '../../domain/entities/Task.js';
import { UserSchema } from '../../domain/entities/users.js';
import { ProductSchema } from '../../domain/entities/Product.js';
import { InitialSchema1700000000000 } from './migrations/InitialSchema1700000000000.js';
import { AddCityAndProducts1700000000001 } from './migrations/AddCityAndProducts1700000000001.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.nodeEnv !== 'production',
  logging: config.nodeEnv === 'development',
  entities: [TaskSchema, UserSchema, ProductSchema],
  migrations: [InitialSchema1700000000000, AddCityAndProducts1700000000001],
  migrationsRun: true,
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
