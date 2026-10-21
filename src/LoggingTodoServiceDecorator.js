// src/LoggingTodoServiceDecorator.js
export class LoggingTodoServiceDecorator {
  constructor(todoService) {
    this.todoService = todoService;   // the wrapped object
  }

  // The two methods that add tasks: log first, then pass the call on.
  addTask(description) {
    console.log('LOG: addTask', description);
    return this.todoService.addTask(description);
  }

  addUrgentTask(description) {
    console.log('LOG: addUrgentTask', description);
    return this.todoService.addUrgentTask(description);
  }

  // Everything else: pass the call on, unchanged.
  toggleComplete(id) { this.todoService.toggleComplete(id); }
  deleteTask(id) { this.todoService.deleteTask(id); }
  getWorkloadSummary() { return this.todoService.getWorkloadSummary(); }
  get tasks() { return this.todoService.tasks; }
}