import { AddTaskCommand, CommandHistory } from './Commands.js';
import { TaskCounter } from './TaskObservers.js';
import { ConfirmDeleteProxy } from './ConfirmDeleteProxy.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';


// ...after the controller is created:
const suggestions = new IdeaBoxAdapter(new IdeaBox());
const suggestBtn = document.getElementById('suggest-btn');

suggestBtn.addEventListener('click', () => {
  controller.addTask(suggestions.getSuggestion());
});

import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { LocalStorageFactory } from './StorageFactory.js';


const factory = new ArchivingStorageFactory();
const todoService = factory.createService();
const service = new ConfirmDeleteProxy(
  new LoggingTodoServiceDecorator(todoService)
);const renderer = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);

controller.start();

const input = document.getElementById('task-input');
const history = new CommandHistory();
addBtn.addEventListener('click', () => {
  history.run(new AddTaskCommand(controller, input.value));
  input.value = '';
});
document.getElementById('undo-btn').addEventListener('click', () => {
  history.undo();
});
const addUrgentBtn = document.getElementById('add-urgent-btn');

const counter = new TaskCounter();
todoService.subscribe(counter);
counter.update(todoService.tasks);

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