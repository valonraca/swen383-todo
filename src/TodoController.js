export class TodoController {
  constructor(todoService, todoRenderer) {
    this.todoService = todoService;
    this.todoRenderer = todoRenderer;

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

  toggleTask(id) {
    if (this.todoService.toggleComplete(id)) {
      this.todoRenderer.render(this.todoService);
    }
  }

  toggleComplete(id) {
    this.toggleTask(id);
  }

  deleteTask(id) {
    this.todoService.deleteTask(id);
    this.todoRenderer.render(this.todoService);
  }
}
