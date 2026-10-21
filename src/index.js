import cors from 'cors';
import express from 'express';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { config } from './config/config.js';
import { initializeDatabase } from './infrastructure/database/data-source.js';
import productRoutes from './interfaces/routes/productRoutes.js';
import taskRoutes from './interfaces/routes/taskRoutes.js';
import userRoutes from './interfaces/routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Management API is running.',
    architecture: 'Clean Architecture (Route -> Controller -> UseCase -> Repository -> TypeORM -> PostgreSQL)',
    endpoints: {
      'POST /tasks': 'Create a task with a title and optional description',
      'GET /tasks': 'Retrieve all tasks',
      'PUT /tasks/:id/status': 'Update a task status',
      'GET /users/email/:email': 'Find a user by email address',
      'GET /products': 'List products',
      'GET /products/:id': 'Find a product by ID',
      'POST /products': 'Create a product',
      'PUT /products/:id': 'Replace a product',
      'DELETE /products/:id': 'Delete a product',
    },
  });
});

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found.`,
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number.isInteger(err.statusCode)
    ? err.statusCode
    : Number.isInteger(err.status)
      ? err.status
      : 500;
  const message = statusCode >= 500 && config.nodeEnv === 'production'
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${err.message || 'Internal Server Error'}`);
  if (config.nodeEnv === 'development' && statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && statusCode === 500 && { stack: err.stack }),
  });
});

export { app };
export default app;

export const startServer = async () => {
  try {
    await initializeDatabase();
    return app.listen(config.port, () => {
      console.log(`Task Management API is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start application server:', error.message);
    process.exitCode = 1;
    return null;
  }
};

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectExecution) {
  await startServer();
}
