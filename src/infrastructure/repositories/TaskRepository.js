import { AppDataSource } from '../database/data-source.js';
import { Task, TaskSchema } from '../../domain/entities/Task.js';

export class TaskRepository {
  constructor(dataSource = AppDataSource) {
    this.dataSource = dataSource;
  }

  get repository() {
    return this.dataSource.getRepository(TaskSchema);
  }

  async save(task) {
    return await this.repository.save(task);
  }

  async create({ title, description = '', status = 'Pending' }) {
    const taskEntity = this.repository.create({
      title,
      description,
      status,
    });
    return await this.repository.save(taskEntity);
  }

  async findAll() {
    return await this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return null;
    }
    return await this.repository.findOneBy({ id: numericId });
  }

  async updateStatus(id, status) {
    const task = await this.findById(id);
    if (!task) {
      return null;
    }
    task.status = status;
    return await this.repository.save(task);
  }
}
