export class TodoController {
  constructor(todoService, todoRenderer) {
    this.todoService = todoService;
    this.todoRenderer = todoRenderer;
    this.todoRenderer.bindActions({ onToggle: (id) => this.toggleTask(id), onDelete: (id) => this.deleteTask(id) });
  }
  start() { this.todoRenderer.render(this.todoService); }
  addTask(description) { const id = this.todoService.addTask(description); if (id) this.todoRenderer.render(this.todoService, id); return id; }
  addUrgentTask(description) { const id = this.todoService.addUrgentTask(description); if (id) this.todoRenderer.render(this.todoService, id); return id; }
  toggleTask(id) { this.todoService.toggleComplete(id); this.todoRenderer.render(this.todoService); }
  deleteTask(id) { this.todoService.deleteTask(id); this.todoRenderer.render(this.todoService); }
}
