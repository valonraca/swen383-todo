// Composition root: create the objects and connect the page events.
import { TodoService } from './TodoService.js';
import { TodoRenderer } from './TodoRenderer.js';
import { LocalStorageHandler } from './LocalStorageHandler.js';
import { TodoController } from './TodoController.js';

const service = new TodoService(new LocalStorageHandler());
const renderer = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);

controller.start();

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');

function add(type) {
  if (controller.addTask(input.value, type)) {
    input.value = '';
  }
}

addBtn.addEventListener('click', () => add('simple'));
addUrgentBtn.addEventListener('click', () => add('urgent'));
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});
