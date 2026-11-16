import { StorageHandler } from './StorageHandler.js';

// Keeps every task that was ever in the list, even after it is deleted.
export class ArchiveStorageHandler extends StorageHandler {
  load() {
    const raw = localStorage.getItem('todo-archive');
    return raw ? JSON.parse(raw) : [];
  }

  save(tasks) {
    const archive = this.load();
    for (const task of tasks) {
      const known = archive.some(a => a.id === task.id);
      if (!known) {
        archive.push(task);
      }
    }
    localStorage.setItem('todo-archive', JSON.stringify(archive));
  }
}
