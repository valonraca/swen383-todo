import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { LocalStorageFactory } from './StorageFactory.js';

const factory = new LocalStorageFactory();
const service = factory.createService();
const renderer = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);
controller.start();

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');
const undoBtn = document.getElementById('undo-btn');

if (!input || !addBtn || !addUrgentBtn || !undoBtn) {
  throw new Error('Required Todo App controls were not found.');
}

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

undoBtn.addEventListener('click', () => {
  if (service.undo()) {
    renderer.render(service);
  }
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});
