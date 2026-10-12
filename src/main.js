import { LocalStorageHandler } from './LocalStorageHandler.js';
import { TodoRenderer } from './TodoRenderer.js';
import { TodoService } from './TodoService.js';
import { TodoController } from './TodoController.js';

window.addEventListener('DOMContentLoaded', () => {
  const storageHandler = new LocalStorageHandler();
  const todoService = new TodoService(storageHandler);
  const todoRenderer = new TodoRenderer('task-container');
  const todoController = new TodoController(todoService, todoRenderer);

  todoController.start();

  const input = document.getElementById('task-input');
  const addButton = document.getElementById('add-task-btn');
  const addUrgentButton = document.getElementById('add-urgent-btn');

  function addTask(type) {
    if (todoController.addTask(input.value, type)) {
      input.value = '';
    }
  }

  addButton.addEventListener('click', () => addTask('simple'));
  addUrgentButton.addEventListener('click', () => addTask('urgent'));
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') addButton.click();
  });
});