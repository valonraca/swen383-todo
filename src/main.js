import { TodoService } from './TodoService.js';
import { TodoRenderer } from './TodoRenderer.js';
import { LocalStorageHandler } from './LocalStorageHandler.js';

// Composition root: the only place that decides which storage the app uses.
window.addEventListener('DOMContentLoaded', () => {
    const storage = new LocalStorageHandler();
    const service = new TodoService(storage);
    const renderer = new TodoRenderer('task-container', service);
    renderer.render();

    const input = document.getElementById('task-input');
    const addBtn = document.getElementById('add-task-btn');
    const addUrgentBtn = document.getElementById('add-urgent-btn');
    const undoBtn = document.getElementById('undo-btn');

    if (!input || !addBtn || !addUrgentBtn || !undoBtn) return;

    const updateUndoButton = () => {
        undoBtn.disabled = !service.canUndo();
    };

    updateUndoButton();

    addBtn.addEventListener('click', () => {
        const task = service.addTask(input.value, 'simple');
        if (task) {
            input.value = '';
            renderer.render(task.id);
            updateUndoButton();
        }
    });

    addUrgentBtn.addEventListener('click', () => {
        const task = service.addTask(input.value, 'urgent');
        if (task) {
            input.value = '';
            renderer.render(task.id);
            updateUndoButton();
        }
    });

    undoBtn.addEventListener('click', () => {
        if (service.undo()) {
            renderer.render();
            updateUndoButton();
        }
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addBtn.click();
        }
    });
});
