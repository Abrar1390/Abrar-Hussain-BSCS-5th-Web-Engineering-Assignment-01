import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { initializeDatabase } from './infrastructure/database/data-source.js';
import taskRoutes from './interfaces/routes/taskRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Management API is running.',
    architecture: 'Clean Architecture (Route -> Controller -> UseCase -> Repository -> TypeORM -> PostgreSQL)',
    endpoints: {
      'POST /tasks': 'Create a new task with title and optional description',
      'GET /tasks': 'Retrieve all tasks',
      'PUT /tasks/:id/status': 'Change task status to Completed',
    },
  });
});

app.use('/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found.`,
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}`);
  if (config.nodeEnv === 'development' && statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(config.port, () => {
      console.log(` Server is running on http://localhost:${config.port}`);
      console.log(` Try: GET http://localhost:${config.port}/tasks`);
    });
  } catch (error) {
    console.error('❌ Failed to start application server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
