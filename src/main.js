import { TodoRenderer } from './TodoRenderer.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { TodoController } from './TodoController.js';
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';

const factory    = new ArchivingStorageFactory();
const service    = new LoggingTodoServiceDecorator(factory.createService());
const renderer   = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);

controller.start();

const input        = document.getElementById('task-input');
const addBtn       = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');
const suggestBtn   = document.getElementById('suggest-btn');

const suggestions = new IdeaBoxAdapter(new IdeaBox());

function add(type) {
  if (controller.addTask(input.value, type)) {
    input.value = '';
  }
}

addBtn.addEventListener('click', () => add('simple'));
addUrgentBtn.addEventListener('click', () => add('urgent'));
suggestBtn.addEventListener('click', () => {
  controller.addTask(suggestions.getSuggestion());
});
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});
