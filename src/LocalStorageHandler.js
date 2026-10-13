// src/LocalStorageHandler.js
// Only job: read and write the task list in localStorage.
export class LocalStorageHandler {
  load() {
    const raw = localStorage.getItem('todo-tasks');
    return raw ? JSON.parse(raw) : [];
  }

  save(tasks) {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }
}