import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { ConfirmDeleteProxy } from './ConfirmDeleteProxy.js';

window.addEventListener('DOMContentLoaded', () => {
  const factory = new ArchivingStorageFactory();
  const todoService = new ConfirmDeleteProxy(
   new LoggingTodoServiceDecorator(factory.createService())
  );
  
  const todoRenderer = new TodoRenderer('task-container');
  const todoController = new TodoController(todoService, todoRenderer);

  const suggestions = new IdeaBoxAdapter(new IdeaBox());
  const suggestButton = document.getElementById('suggest-btn');

  suggestButton.addEventListener('click', () => {
    todoController.addTask(suggestions.getSuggestion());
  });

  todoController.start();

  const input = document.getElementById('task-input');
  const addButton = document.getElementById('add-task-btn');
  const addUrgentButton = document.getElementById('add-urgent-btn');

  addButton.addEventListener('click', () => {
    if (todoController.addTask(input.value)) {
      input.value = '';
    }
  });

  addUrgentButton.addEventListener('click', () => {
    if (todoController.addUrgentTask(input.value)) {
      input.value = '';
    }
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') addButton.click();
  });
});
