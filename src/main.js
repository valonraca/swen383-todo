
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { SortByName, SortByNewest } from './SortStrategy.js';

import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { LocalStorageFactory } from './StorageFactory.js';

// Create service with logging decorator
const factory = new LocalStorageFactory();
const service = new LoggingTodoServiceDecorator(
  factory.createService()
);

// Create renderer and controller
const renderer = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);

// Start application
controller.start();

// HTML elements
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');
const taskContainer = document.getElementById('task-container');

// Add suggestion functionality
const suggestions = new IdeaBoxAdapter(new IdeaBox());
const suggestBtn = document.getElementById('suggest-btn');

if (suggestBtn) {
  suggestBtn.addEventListener('click', () => {
    controller.addTask(suggestions.getSuggestion());
  });
}

// Add normal task
addBtn.addEventListener('click', () => {
  if (controller.addTask(input.value)) {
    input.value = '';
  }
});

// Add urgent task
addUrgentBtn.addEventListener('click', () => {
  if (controller.addUrgentTask(input.value)) {
    input.value = '';
  }
});

// Enter key adds task
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});

// Toggle and delete tasks
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

// Sort alphabetically
const sortNameBtn = document.getElementById('sort-name-btn');

if (sortNameBtn) {
  sortNameBtn.addEventListener('click', () => {
    service.setSortStrategy(new SortByName());
    controller.start();
  });
}

// Sort by newest
const sortNewestBtn = document.getElementById('sort-newest-btn');

if (sortNewestBtn) {
  sortNewestBtn.addEventListener('click', () => {
    service.setSortStrategy(new SortByNewest());
    controller.start();
  });
}
