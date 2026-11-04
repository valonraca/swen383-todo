import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { TodoRenderer } from './TodoRenderer.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { TodoController } from './TodoController.js';

const factory = new ArchivingStorageFactory();
const service = new LoggingTodoServiceDecorator(factory.createService());
const renderer = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);

const suggestions = new IdeaBoxAdapter(new IdeaBox());

controller.start();

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');

document.getElementById('task-container').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-toggle], button[data-delete]');
  if (!button) return;
  if (button.hasAttribute('data-toggle')) {
    controller.toggleTask(Number(button.dataset.toggle));
  } else {
    controller.deleteTask(Number(button.dataset.delete));
  }
});

addBtn.addEventListener('click', () => {
  if (controller.addTask(input.value)) input.value = '';
});
addUrgentBtn.addEventListener('click', () => {
  if (controller.addUrgentTask(input.value)) input.value = '';
});
document.getElementById('suggest-btn').addEventListener('click', () => {
  controller.addTask(suggestions.getSuggestion());
});
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});
