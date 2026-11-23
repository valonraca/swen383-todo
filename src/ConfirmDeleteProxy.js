// src/ConfirmDeleteProxy.js
export class ConfirmDeleteProxy {
  constructor(todoService) {
    this.todoService = todoService;   // the real object
  }

  // The one call the proxy decides about.
  deleteTask(id) {
    if (confirm('Delete this task?')) {
      this.todoService.deleteTask(id);
    }
  }

  // Everything else: pass the call on, unchanged.
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