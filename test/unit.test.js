import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { Task } from '../src/domain/entities/Task.js';
import { CreateTask } from '../src/application/usecases/CreateTask.js';
import { GetTasks } from '../src/application/usecases/GetTasks.js';
import { UpdateTaskStatus } from '../src/application/usecases/UpdateTaskStatus.js';
import { TaskController } from '../src/interfaces/controllers/TaskController.js';

describe('Clean Architecture Layer Tests', () => {
  describe('Domain Layer: Task Entity', () => {
    test('should instantiate a valid Task entity', () => {
      const task = new Task({
        id: 1,
        title: 'Complete Assignment',
        description: 'Implement clean architecture',
        status: 'Pending',
        createdAt: new Date(),
      });

      assert.equal(task.title, 'Complete Assignment');
      assert.equal(task.status, 'Pending');
      assert.doesNotThrow(() => task.validate());
    });

    test('should mark task as completed', () => {
      const task = new Task({ title: 'Task 1' });
      assert.equal(task.status, 'Pending');
      task.complete();
      assert.equal(task.status, 'Completed');
    });

    test('should throw validation error if title is empty', () => {
      const task = new Task({ title: '' });
      assert.throws(() => task.validate(), /Task title is required/);
    });
  });

  describe('Application Layer: Use Cases', () => {
    class InMemoryTaskRepository {
      constructor() {
        this.tasks = [];
        this.nextId = 1;
      }

      async create({ title, description, status = 'Pending' }) {
        const task = {
          id: this.nextId++,
          title,
          description,
          status,
          createdAt: new Date(),
        };
        this.tasks.push(task);
        return task;
      }

      async findAll() {
        return [...this.tasks];
      }

      async findById(id) {
        return this.tasks.find((t) => t.id === parseInt(id, 10)) || null;
      }

      async updateStatus(id, status) {
        const task = await this.findById(id);
        if (!task) return null;
        task.status = status;
        return task;
      }
    }

    test('CreateTask use case should validate and create a task', async () => {
      const repo = new InMemoryTaskRepository();
      const useCase = new CreateTask(repo);

      const task = await useCase.execute({
        title: 'Study Web Engineering',
        description: 'Read Clean Architecture concepts',
      });

      assert.equal(task.id, 1);
      assert.equal(task.title, 'Study Web Engineering');
      assert.equal(task.status, 'Pending');
    });

    test('CreateTask use case should reject empty title', async () => {
      const repo = new InMemoryTaskRepository();
      const useCase = new CreateTask(repo);

      await assert.rejects(
        async () => await useCase.execute({ title: '   ' }),
        (err) => err.statusCode === 400 && err.message.includes('required')
      );
    });

    test('GetTasks use case should return all tasks', async () => {
      const repo = new InMemoryTaskRepository();
      const createTask = new CreateTask(repo);
      const getTasks = new GetTasks(repo);

      await createTask.execute({ title: 'Task 1' });
      await createTask.execute({ title: 'Task 2' });

      const allTasks = await getTasks.execute();
      assert.equal(allTasks.length, 2);
      assert.equal(allTasks[0].title, 'Task 1');
      assert.equal(allTasks[1].title, 'Task 2');
    });

    test('UpdateTaskStatus use case should change status to Completed', async () => {
      const repo = new InMemoryTaskRepository();
      const createTask = new CreateTask(repo);
      const updateStatus = new UpdateTaskStatus(repo);

      const created = await createTask.execute({ title: 'Task to finish' });
      assert.equal(created.status, 'Pending');

      const updated = await updateStatus.execute({ id: created.id, status: 'Completed' });
      assert.equal(updated.status, 'Completed');
    });

    test('UpdateTaskStatus use case should return 404 for non-existent task', async () => {
      const repo = new InMemoryTaskRepository();
      const updateStatus = new UpdateTaskStatus(repo);

      await assert.rejects(
        async () => await updateStatus.execute({ id: 999, status: 'Completed' }),
        (err) => err.statusCode === 404
      );
    });
  });

  describe('Interface Layer: TaskController', () => {
    test('TaskController.createTask should send 201 response', async () => {
      const mockUseCase = {
        execute: async (input) => ({ id: 10, ...input, status: 'Pending' }),
      };

      const controller = new TaskController({
        createTaskUseCase: mockUseCase,
        getTasksUseCase: {},
        updateTaskStatusUseCase: {},
      });

      let responseStatus = null;
      let responseBody = null;

      const req = { body: { title: 'Controller Test', description: 'Testing controller' } };
      const res = {
        status(code) {
          responseStatus = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await controller.createTask(req, res, () => {});

      assert.equal(responseStatus, 201);
      assert.equal(responseBody.success, true);
      assert.equal(responseBody.data.title, 'Controller Test');
    });
  });
});
