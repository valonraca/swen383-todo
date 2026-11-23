// LocalStorageHandler is the only code that knows tasks live in localStorage.
export class LocalStorageHandler {
    constructor(key = 'todo-tasks') {
        this.key = key;
    }

    load() {
        const raw = localStorage.getItem(this.key);
        return raw ? JSON.parse(raw) : [];
    }

    save(tasks) {
        localStorage.setItem(this.key, JSON.stringify(tasks));
    }
}