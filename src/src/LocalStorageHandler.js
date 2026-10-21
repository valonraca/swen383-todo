
// src/LocalStorageHandler.js
import { StorageHandler } from './StorageHandler.js';

export class LocalStorageHandler extends StorageHandler {
  load() {
    const raw = localStorage.getItem('todo-tasks');
    return raw ? JSON.parse(raw) : [];
  }
  save(tasks) {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }
}