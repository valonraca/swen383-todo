import { StorageHandler } from './StorageHandler.js';

export class ArchiveStorageHandler extends StorageHandler {
  load() {
    const raw = localStorage.getItem('todo-archive');
    return raw ? JSON.parse(raw) : [];
  }

  save(tasks) {
    const archive = this.load();
    for (const task of tasks) {
      const known = archive.some(item => item.id === task.id);
      if (!known) {
        archive.push(task);
      }
    }
    localStorage.setItem('todo-archive', JSON.stringify(archive));
  }
}