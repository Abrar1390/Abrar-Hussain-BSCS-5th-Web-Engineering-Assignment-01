export class CreateTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ title, description = '' }) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      const error = new Error('Task title is required and cannot be empty.');
      error.statusCode = 400;
      throw error;
    }

    const newTask = await this.taskRepository.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: 'Pending',
    });

    return newTask;
  }
}
