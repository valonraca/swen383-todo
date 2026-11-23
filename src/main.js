// src/main.js
import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { ConfirmDeleteProxy } from './ConfirmDeleteProxy.js';
import { TaskCounter } from './TaskObservers.js';
import { AddTaskCommand, CommandHistory } from './Commands.js';
import { SortByName, SortByNewest } from './SortStrategy.js';

const factory = new ArchivingStorageFactory();
const todoService = factory.createService();
const service = new ConfirmDeleteProxy(
  new LoggingTodoServiceDecorator(todoService)
);
const renderer = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);

controller.start();

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');

// Command: Add goes through the history so it can be undone
const history = new CommandHistory();
addBtn.addEventListener('click', () => {
  history.run(new AddTaskCommand(controller, input.value));
  input.value = '';
});
document.getElementById('undo-btn').addEventListener('click', () => {
  history.undo();
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

const suggestions = new IdeaBoxAdapter(new IdeaBox());
const suggestBtn = document.getElementById('suggest-btn');

suggestBtn.addEventListener('click', () => {
  controller.addTask(suggestions.getSuggestion());
});

// Observer: the task counter
const counter = new TaskCounter();
todoService.subscribe(counter);
counter.update(todoService.tasks);   // show the count at the start

// Strategy: the client picks which sort order TodoService uses
document.getElementById('sort-name-btn').addEventListener('click', () => {
  todoService.setSortStrategy(new SortByName());
  controller.start();               // draw the list again
});
document.getElementById('sort-newest-btn').addEventListener('click', () => {
  todoService.setSortStrategy(new SortByNewest());
  controller.start();
});