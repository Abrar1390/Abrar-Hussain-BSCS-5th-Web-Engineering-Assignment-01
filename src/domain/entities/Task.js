import { EntitySchema } from 'typeorm';

export const TASK_STATUSES = Object.freeze(['Pending', 'Completed']);

export class Task {
  constructor({ id = null, title, description = '', status = 'Pending', createdAt = null } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
  }

  complete() {
    this.status = 'Completed';
  }

  validate() {
    if (!this.title || typeof this.title !== 'string' || this.title.trim() === '') {
      throw new Error('Task title is required and cannot be empty.');
    }
    if (this.title.trim().length > 255) {
      throw new Error('Task title cannot exceed 255 characters.');
    }
    if (typeof this.description !== 'string') {
      throw new Error('Task description must be a string.');
    }

    if (!TASK_STATUSES.includes(this.status)) {
      throw new Error(`Invalid status. Allowed values are: ${TASK_STATUSES.join(', ')}`);
    }

    return this;
  }
}

export const TaskSchema = new EntitySchema({
  name: 'Task',
  target: Task,
  tableName: 'tasks',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    title: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    status: {
      type: 'varchar',
      length: 50,
      default: 'Pending',
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
      insert: false,
      update: false,
    },
  },
});
