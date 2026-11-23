// src/TodoController.js
export class TodoController {
  constructor(todoService, todoRenderer) {
    this.todoService = todoService;
    this.todoRenderer = todoRenderer;
  }

  start() {
    this.todoRenderer.render(this.todoService);
  }

  addTask(description, type) {
    const newId = this.todoService.addTask(description, type);
    if (newId) {
      this.todoRenderer.render(this.todoService, newId);
    }
    return newId;
  }
}
