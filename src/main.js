import { TodoRenderer } from './TodoRenderer.js';
import { LocalStorageFactory } from './StorageFactory.js';
import { TodoController } from './TodoController.js';

window.addEventListener('DOMContentLoaded', () => {
  const factory = new LocalStorageFactory();
  const service = factory.createService();
  const renderer = new TodoRenderer('task-container');
  const controller = new TodoController(service, renderer);
  controller.start();

  const input = document.getElementById('task-input');
  const addBtn = document.getElementById('add-task-btn');
  const addUrgentBtn = document.getElementById('add-urgent-btn');

  function add(type) {
    const newId = controller.addTask(input.value, type);
    if (newId) {
      input.value = '';
    } else {
      alert('Task needs at least a few characters.');
    }
  }

  addBtn.addEventListener('click', () => add('simple'));
  addUrgentBtn.addEventListener('click', () => add('urgent'));
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') addBtn.click();
  });
});
