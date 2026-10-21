// TodoController is the GRASP Controller: it receives UI events and delegates.
// It does two things only: call the service, then tell the renderer.
export class TodoController {
  constructor(todoService, todoRenderer) {   // dependencies injected (DIP)
    this.todoService = todoService;
    this.todoRenderer = todoRenderer;
  }

  start() {
    this.todoRenderer.render(this.todoService);
  }

  addTask(description) {
    const newId = this.todoService.addTask(description);
    if (newId) {
      this.todoRenderer.render(this.todoService, newId);
    }
    return newId;
  }

  addUrgentTask(description) {
    const newId = this.todoService.addUrgentTask(description);
    if (newId) {
      this.todoRenderer.render(this.todoService, newId);
    }
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
