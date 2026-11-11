// src/TodoController.js
export class TodoController {
  constructor(todoService, todoRenderer) {
    this.todoService = todoService;
    this.todoRenderer = todoRenderer;

    if (this.todoRenderer && this.todoRenderer.container) {
      this.todoRenderer.container.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-toggle]');
        if (toggleBtn) {
          this.toggleTask(Number(toggleBtn.dataset.toggle));
        }
        const deleteBtn = e.target.closest('[data-delete]');
        if (deleteBtn) {
          this.deleteTask(Number(deleteBtn.dataset.delete));
        }
      });
    }
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
    if (this.todoService.toggleComplete(id)) {
      this.todoRenderer.render(this.todoService);
    }
  }

  deleteTask(id) {
    this.todoService.deleteTask(id);
    this.todoRenderer.render(this.todoService);
  }
}
