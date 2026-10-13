// Persistence adapter: the service only relies on load() and save(tasks).
export class LocalStorageHandler {
  load() {
    const raw = localStorage.getItem('todo-tasks');
    return raw ? JSON.parse(raw) : [];
  }

  save(tasks) {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }
}
