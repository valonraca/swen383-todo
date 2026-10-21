export class TodoController {
  constructor(todoService, todoRenderer) {
    this.todoService = todoService;
    this.todoRenderer = todoRenderer;
    todoRenderer.bindActions({
      onToggle: id => this.toggleTask(id),
      onDelete: id => this.deleteTask(id)
    });
  }

  start() {
    this.todoRenderer.render(this.todoService);
  }

  addTask(description, type) {
    const newId = this.todoService.addTask(description, type);
    if (newId) this.todoRenderer.render(this.todoService, newId);
    return newId;
  }

  toggleTask(id) {
    this.todoService.toggleComplete(id);
    this.todoRenderer.render(this.todoService);
  }

  deleteTask(id) {
    this.todoService.deleteTask(id);
    this.todoRenderer.render(this.todoService);
  }
}
