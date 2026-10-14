import { LocalStorageFactory } from './StorageFactory.js';
import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';

const service = new LocalStorageFactory().createService();
const renderer = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);
controller.start();
const input = document.getElementById('task-input');
function add(method) { if (controller[method](input.value)) input.value = ''; }
document.getElementById('add-task-btn').addEventListener('click', () => add('addTask'));
document.getElementById('add-urgent-btn').addEventListener('click', () => add('addUrgentTask'));
input.addEventListener('keydown', (event) => { if (event.key === 'Enter') document.getElementById('add-task-btn').click(); });
