# Todo App

A small browser Todo list: add tasks, mark them complete, delete them. Tasks are kept in the
browser's local storage. Plain HTML, CSS and JavaScript, no build step.

This is the shared codebase for SWEN-383 (Software Design Principles and Patterns) at RIT Kosovo.
Every student forks this repository in Week 1 and evolves it, week by week, as the course covers
new design principles and patterns.

## Running it

Open `index.html` with a live-reloading server, such as the VS Code "Live Server" extension, and it
runs in your browser. Nothing to install beyond Git, a browser, and an editor.

## Files

- `index.html` - page structure
- `style.css` - styling
- `src/main.js` - application wiring and browser event handlers
- `src/TodoController.js` - coordinates user actions between the service and renderer
- `src/TodoService.js` - task behavior and business rules
- `src/Task.js` and `src/TaskBuilder.js` - task construction
- `src/TodoRenderer.js` - renders the task list
- `src/StorageHandler.js` - storage backend contract
- `src/LocalStorageHandler.js` and `src/InMemoryStorageHandler.js` - storage backends
- `src/StorageFactory.js` - creates services with the selected storage backend

## License

MIT - see `LICENSE`.
