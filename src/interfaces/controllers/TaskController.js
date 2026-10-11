export class TaskController {
  constructor({ createTaskUseCase, getTasksUseCase, updateTaskStatusUseCase }) {
    this.createTaskUseCase = createTaskUseCase;
    this.getTasksUseCase = getTasksUseCase;
    this.updateTaskStatusUseCase = updateTaskStatusUseCase;
  }

  createTask = async (req, res, next) => {
    try {
      const { title, description } = req.body;
      const task = await this.createTaskUseCase.execute({ title, description });

      return res.status(201).json({
        success: true,
        message: 'Task created successfully.',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  getTasks = async (req, res, next) => {
    try {
      const tasks = await this.getTasksUseCase.execute();

      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTaskStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body || {};

      const updatedTask = await this.updateTaskStatusUseCase.execute({
        id,
        status: status || 'Completed',
      });

      return res.status(200).json({
        success: true,
        message: `Task status updated to ${updatedTask.status}.`,
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  };
}
