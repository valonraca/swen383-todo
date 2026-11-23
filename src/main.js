import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { TodoRenderer } from './TodoRenderer.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { TodoController } from './TodoController.js';
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

const suggestions = new IdeaBoxAdapter(new IdeaBox());

controller.start();
const counter = new TaskCounter();
todoService.subscribe(counter);
counter.update(todoService.tasks);

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');
const history = new CommandHistory();

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
  history.run(new AddTaskCommand(controller, input.value));
  input.value = '';
});
document.getElementById('undo-btn').addEventListener('click', () => {
  history.undo();
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

document.getElementById('sort-name-btn').addEventListener('click', () => {
  todoService.setSortStrategy(new SortByName());
  controller.start();
});
document.getElementById('sort-newest-btn').addEventListener('click', () => {
  todoService.setSortStrategy(new SortByNewest());
  controller.start();
});
