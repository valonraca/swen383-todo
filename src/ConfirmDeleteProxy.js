export class ConfirmDeleteProxy {
  constructor(todoService) {
    this.todoService = todoService;
  }

  deleteTask(id) {
    if (confirm('Delete this task?')) {
      this.todoService.deleteTask(id);
    }
  }

  addTask(description) {
    return this.todoService.addTask(description);
  }

  addUrgentTask(description) {
    return this.todoService.addUrgentTask(description);
  }

  toggleComplete(id) { this.todoService.toggleComplete(id); }
  getWorkloadSummary() { return this.todoService.getWorkloadSummary(); }
  get tasks() { return this.todoService.tasks; }
}
