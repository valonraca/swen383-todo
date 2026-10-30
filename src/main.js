// src/main.js
// src/main.js: two new imports at the top
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';

// before
// const service = factory.createService();
// after
const service = new LoggingTodoServiceDecorator(factory.createService());
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';

// ...after the controller is created:
const suggestions = new IdeaBoxAdapter(new IdeaBox());
const suggestBtn = document.getElementById('suggest-btn');

suggestBtn.addEventListener('click', () => {
  controller.addTask(suggestions.getSuggestion());
});
import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { LocalStorageFactory } from './StorageFactory.js';

const factory = new LocalStorageFactory();
const service = factory.createService();
const renderer   = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);

controller.start();

const input        = document.getElementById('task-input');
const addBtn       = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');
const taskContainer = document.getElementById('task-container');

addBtn.addEventListener('click', () => {
  if (controller.addTask(input.value)) {
    input.value = '';
  }
});

addUrgentBtn.addEventListener('click', () => {
  if (controller.addUrgentTask(input.value)) {
    input.value = '';
  }
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});

taskContainer.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const toggleButton = event.target.closest('[data-toggle]');
  if (toggleButton) {
    controller.toggleTask(Number(toggleButton.dataset.toggle));
    return;
  }

  const deleteButton = event.target.closest('[data-delete]');
  if (deleteButton) {
    controller.deleteTask(Number(deleteButton.dataset.delete));
  }
});