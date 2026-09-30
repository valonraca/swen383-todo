import { LocalStorageHandler } from './LocalStorageHandler.js';
import { TodoService } from './TodoService.js';
import { TodoRenderer } from './TodoRenderer.js';

window.addEventListener('DOMContentLoaded', () => {
  const storage = new LocalStorageHandler();
  const service = new TodoService(storage);
  const renderer = new TodoRenderer('task-container', service);
  
  renderer.render();

  const input = document.getElementById('task-input');
  const addBtn = document.getElementById('add-task-btn');
  const addUrgentBtn = document.getElementById('add-urgent-btn');

  addBtn.addEventListener('click', () => {
    const justAddedId = service.addTask(input.value, 'simple');
    if (justAddedId) {
      input.value = '';
      renderer.render(justAddedId);
    }
  });

  addUrgentBtn.addEventListener('click', () => {
    const justAddedId = service.addTask(input.value, 'urgent');
    if (justAddedId) {
      input.value = '';
      renderer.render(justAddedId);
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addBtn.click();
    }
  });
});
