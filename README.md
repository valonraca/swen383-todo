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
- `src/LocalStorageHandler.js` - saving and loading tasks
- `src/TodoService.js` - task list and operations
- `src/TodoRenderer.js` - rendering the list
- `src/TodoController.js` - user action orchestration
- `src/main.js` - starts the app and wires the pieces together

## License

MIT - see `LICENSE`.
