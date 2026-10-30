// Persists tasks using the load()/save(tasks) contract expected by TodoService.
export class LocalStorageHandler {
  load() {
    const raw = localStorage.getItem('todo-tasks');
    return raw ? JSON.parse(raw) : [];
  }

  save(tasks) {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }
}
