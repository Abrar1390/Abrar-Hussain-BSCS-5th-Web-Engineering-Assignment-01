import { Task } from '../../domain/entities/Task.js';

export class CreateTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ title, description = '' } = {}) {
    const task = new Task({ title, description, status: 'Pending' });

    try {
      task.validate();
    } catch (validationError) {
      const error = new Error(validationError.message);
      error.statusCode = 400;
      throw error;
    }

    return this.taskRepository.create({
      title: task.title.trim(),
      description: task.description.trim(),
      status: task.status,
    });
  }
}
