import { TASK_STATUSES } from '../../domain/entities/Task.js';

export class UpdateTaskStatus {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ id, status = 'Completed' } = {}) {
    if (typeof id !== 'string' && typeof id !== 'number') {
      const error = new Error('Invalid task ID format. Task ID must be a positive integer.');
      error.statusCode = 400;
      throw error;
    }

    const idString = String(id);
    const numericId = Number(idString);
    if (!/^\d+$/.test(idString) || !Number.isSafeInteger(numericId) || numericId < 1) {
      const error = new Error('Invalid task ID format. Task ID must be a positive integer.');
      error.statusCode = 400;
      throw error;
    }

    if (typeof status !== 'string' || !TASK_STATUSES.includes(status)) {
      const error = new Error(`Invalid status '${status}'. Allowed values are: ${TASK_STATUSES.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const existingTask = await this.taskRepository.findById(numericId);
    if (!existingTask) {
      const error = new Error(`Task with ID ${numericId} not found.`);
      error.statusCode = 404;
      throw error;
    }

    const updatedTask = await this.taskRepository.updateStatus(numericId, status);
    if (!updatedTask) {
      const error = new Error(`Task with ID ${numericId} not found.`);
      error.statusCode = 404;
      throw error;
    }
    return updatedTask;
  }
}
