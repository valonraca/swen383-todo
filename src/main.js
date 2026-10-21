// src/main.js
import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { LocalStorageFactory } from './StorageFactory.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';

const factory    = new LocalStorageFactory();
const service = new LoggingTodoServiceDecorator(factory.createService());
const renderer   = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);
const suggestions = new IdeaBoxAdapter(new IdeaBox());
const suggestBtn = document.getElementById('suggest-btn');

suggestBtn.addEventListener('click', () => {
  controller.addTask(suggestions.getSuggestion());
});

controller.start();

const input        = document.getElementById('task-input');
const addBtn       = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');

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