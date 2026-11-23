// LocalStorageHandler is the only code that knows tasks live in localStorage.
import { StorageHandler } from './StorageHandler.js';

export class LocalStorageHandler extends StorageHandler {
    constructor(key = 'todo-tasks') {
        super();
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