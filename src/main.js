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

function submitTask(createTask) {
  try {
    const newId = createTask(input.value);

    if (newId) {
      input.value = '';
    } else {
      renderer.showError('Task needs at least 3 characters.');
    }
  } catch (error) {
    console.error(error);
    renderer.showError('Could not add the task.');
  }
}

addBtn.addEventListener('click', (event) => {
  event.preventDefault();
  submitTask(description => controller.addTask(description));
});

addUrgentBtn.addEventListener('click', (event) => {
  event.preventDefault();
  submitTask(description => controller.addUrgentTask(description));
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.isComposing) {
    event.preventDefault();
    addBtn.click();
  }
});