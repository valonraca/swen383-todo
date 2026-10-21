export class LoggingTodoServiceDecorator {
  constructor(todoService) {
    this.todoService = todoService;
  }

  addTask(description) {
    console.log('LOG: addTask', description);
    return this.todoService.addTask(description);
  }

  addUrgentTask(description) {
    console.log('LOG: addUrgentTask', description);
    return this.todoService.addUrgentTask(description);
  }

  toggleComplete(id) { this.todoService.toggleComplete(id); }
  deleteTask(id) { this.todoService.deleteTask(id); }
  getWorkloadSummary() { return this.todoService.getWorkloadSummary(); }
  get tasks() { return this.todoService.tasks; }
}
