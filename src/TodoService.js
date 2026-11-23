// TodoService owns the task list and the operations on it. No DOM in here.
export class TodoService {
    constructor(storage) {
        this.storage = storage;
        this.tasks = this.storage.load();
        this.history = [];
    }

    saveTasks() {
        this.storage.save(this.tasks);
    }

    createTaskId() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
        return true;
    }

    undoLastAction() {
        return this.undo();
    }

    addTask(description, type) {
        const trimmed = description.trim();
        if (trimmed.length < 3) {
            alert('Task needs at least a few characters.');
            return null;
        }

        if (this.tasks.length >= 20) {
            console.warn('This list is getting long - consider clearing completed tasks.');
        }

        const task = {
            id: this.createTaskId(),
            desc: trimmed,
            completed: false,
            priority: type === 'urgent' ? 'high' : 'normal',
            createdAt: new Date().toLocaleTimeString()
        };

        this.rememberState();
        this.tasks.push(task);
        this.saveTasks();
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
        task.completed = !task.completed;
        this.saveTasks();
    }

    deleteTask(id) {
        const taskId = Number(id);
        const task = this.tasks.find((t) => t.id === id || Number(t.id) === taskId);
        if (!task) return;
        this.rememberState();
        this.tasks = this.tasks.filter((t) => Number(t.id) !== taskId && t.id !== id);
        this.saveTasks();
    }
}