// src/main.js
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { ConfirmDeleteProxy } from './ConfirmDeleteProxy.js';
import { TaskCounter } from './TaskObservers.js';
import { AddTaskCommand, CommandHistory } from './Commands.js';
import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { LocalStorageFactory } from './StorageFactory.js';
import { SortByName, SortByNewest } from './SortStrategy.js';

// const factory = new LocalStorageFactory();
const factory = new ArchivingStorageFactory();
//const service = new LoggingTodoServiceDecorator(factory.createService());
const todoService = factory.createService();
const history = new CommandHistory();
addBtn.addEventListener('click', () => {
  history.run(new AddTaskCommand(controller, input.value));
  input.value = '';
});
document.getElementById('undo-btn').addEventListener('click', () => {
  history.undo();
});
const renderer   = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);

controller.start();

const input        = document.getElementById('task-input');
const addBtn       = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');


suggestBtn.addEventListener('click', () => {
  controller.addTask(suggestions.getSuggestion());
});

const suggestions = new IdeaBoxAdapter(new IdeaBox());
const suggestBtn = document.getElementById('suggest-btn');

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
const counter = new TaskCounter();
todoService.subscribe(counter);
counter.update(todoService.tasks);   // show the count at the start

document.getElementById('sort-name-btn').addEventListener('click', () => {
  todoService.setSortStrategy(new SortByName());
  controller.start();               // draw the list again
});
document.getElementById('sort-newest-btn').addEventListener('click', () => {
  todoService.setSortStrategy(new SortByNewest());
  controller.start();
});