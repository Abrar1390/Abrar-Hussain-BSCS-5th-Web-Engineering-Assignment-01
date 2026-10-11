export class GetTasks {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute() {
    return await this.taskRepository.findAll();
  }
}
