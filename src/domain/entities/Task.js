import { EntitySchema } from 'typeorm';

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

    const validStatuses = ['Pending', 'Completed'];
    if (this.status && !validStatuses.includes(this.status)) {
      throw new Error(`Invalid status. Allowed values are: ${validStatuses.join(', ')}`);
    }
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
