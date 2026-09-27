import { LocalStorageHandler } from './LocalStorageHandler.js';
import { TodoRenderer } from './TodoRenderer.js';
import { TodoService } from './TodoService.js';

window.addEventListener('DOMContentLoaded', () => {
  const storageHandler = new LocalStorageHandler();
  const todoService = new TodoService(storageHandler);
  const todoRenderer = new TodoRenderer('task-container', todoService);
  todoRenderer.bindControls();
  todoRenderer.render();
});