import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { ConfirmDeleteProxy } from './ConfirmDeleteProxy.js';
import { TaskCounter } from './TaskObservers.js';
import { AddTaskCommand, CommandHistory } from './Commands.js';

const factory = new ArchivingStorageFactory();
const todoService = factory.createService();
const service = new ConfirmDeleteProxy(
  new LoggingTodoServiceDecorator(todoService)
);
const renderer = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);
controller.start();
const suggestions = new IdeaBoxAdapter(new IdeaBox());

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');
const suggestBtn = document.getElementById('suggest-btn');
const undoBtn = document.getElementById('undo-btn');

if (!input || !addBtn || !addUrgentBtn || !suggestBtn || !undoBtn) {
  throw new Error('Required Todo App controls were not found.');
}

const history = new CommandHistory();
addBtn.addEventListener('click', () => {
  history.run(new AddTaskCommand(controller, input.value));
  input.value = '';
});

undoBtn.addEventListener('click', () => {
  history.undo();
});

addUrgentBtn.addEventListener('click', () => {
  if (controller.addUrgentTask(input.value)) {
    input.value = '';
  }
});

suggestBtn.addEventListener('click', () => {
  controller.addTask(suggestions.getSuggestion());
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});

const counter = new TaskCounter();
todoService.subscribe(counter);
counter.update(todoService.tasks);
