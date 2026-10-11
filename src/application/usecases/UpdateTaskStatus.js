export class UpdateTaskStatus {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ id, status = 'Completed' }) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      const error = new Error('Invalid task ID format. Task ID must be an integer.');
      error.statusCode = 400;
      throw error;
    }

    const validStatuses = ['Pending', 'Completed'];
    const targetStatus = status || 'Completed';

    if (!validStatuses.includes(targetStatus)) {
      const error = new Error(`Invalid status '${targetStatus}'. Allowed values are: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const existingTask = await this.taskRepository.findById(numericId);
    if (!existingTask) {
      const error = new Error(`Task with ID ${numericId} not found.`);
      error.statusCode = 404;
      throw error;
    }

    const updatedTask = await this.taskRepository.updateStatus(numericId, targetStatus);
    return updatedTask;
  }
}
