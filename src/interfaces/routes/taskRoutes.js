import { Router } from 'express';
import { TaskRepository } from '../../infrastructure/repositories/TaskRepository.js';
import { CreateTask } from '../../application/usecases/CreateTask.js';
import { GetTasks } from '../../application/usecases/GetTasks.js';
import { UpdateTaskStatus } from '../../application/usecases/UpdateTaskStatus.js';
import { TaskController } from '../controllers/TaskController.js';

const router = Router();

const taskRepository = new TaskRepository();

const createTaskUseCase = new CreateTask(taskRepository);
const getTasksUseCase = new GetTasks(taskRepository);
const updateTaskStatusUseCase = new UpdateTaskStatus(taskRepository);

const taskController = new TaskController({
  createTaskUseCase,
  getTasksUseCase,
  updateTaskStatusUseCase,
});

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.put('/:id/status', taskController.updateTaskStatus);

export default router;
