// TodoService owns the task list and the operations on it. No DOM in here.
import { TaskBuilder } from './TaskBuilder.js';
import { stateOf } from './TaskState.js';

export class TodoService {
    constructor(storage) {
        this.storage = storage;
        this.tasks = this.storage.load();
        this.history = [];
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify() {
        for (const observer of this.observers) {
            observer.update(this.tasks);
        }
    }

    setSortStrategy(strategy) {
        this.sortStrategy = strategy;
        this.applySort();
        this.notify();
    }

    applySort() {
        if (this.sortStrategy) {
            this.sortStrategy.sort(this.tasks);
        }
    }

    saveTasks() {
        this.storage.save(this.tasks);
    }

    rememberState() {
        this.history.push(this.tasks.map((task) => ({ ...task })));
    }

    canUndo() {
        return this.history.length > 0;
    }

    undo() {
        if (!this.canUndo()) return false;
        this.tasks = this.history.pop();
        this.saveTasks();
        this.notify();
        return true;
    }

    undoLastAction() {
        return this.undo();
    }

    addTask(description) {
        const trimmed = this.validate(description);
        if (!trimmed) return null;
        const task = new TaskBuilder(trimmed).build();
        return this.store(task);
    }

    addUrgentTask(description) {
        const trimmed = this.validate(description);
        if (!trimmed) return null;
        const task = new TaskBuilder(trimmed)
            .setPriority('high')
            .addLabel('URGENT')
            .build();
        return this.store(task);
    }

    validate(description) {
        const trimmed = description.trim();
        if (trimmed.length < 3) {
            alert('Task needs at least a few characters.');
            return null;
        }

        if (this.tasks.length >= 20) {
            console.warn('This list is getting long - consider clearing completed tasks.');
        }
        return trimmed;
    }

    store(task) {
        this.rememberState();
        this.tasks.push(task);
        this.applySort();
        this.saveTasks();
        this.notify();
        return task.id;
    }

    getWorkloadSummary() {
        let done = 0;
        let urgent = 0;
        let normal = 0;

        for (const task of this.tasks) {
            if (task.completed) {
                done++;
            } else if (task.priority === 'high') {
                urgent++;
            } else {
                normal++;
            }
        }

        return `${done}/${this.tasks.length} done - ${urgent} urgent, ${normal} normal remaining`;
    }

    toggleComplete(id) {
        const task = this.tasks.find((t) => t.id === id || Number(t.id) === Number(id));
        if (!task) return;
        this.rememberState();
        stateOf(task).next(task);
        this.saveTasks();
        this.notify();
    }

    deleteTask(id) {
        const taskId = Number(id);
        const task = this.tasks.find((t) => t.id === id || Number(t.id) === taskId);
        if (!task) return;
        this.rememberState();
        this.tasks = this.tasks.filter((t) => Number(t.id) !== taskId && t.id !== id);
        this.saveTasks();
        this.notify();
    }
}