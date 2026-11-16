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

- `index.html` and `style.css` - page structure and styling
- `src/main.js` - application wiring
- `src/TodoService.js`, `src/TodoRenderer.js`, and `src/TodoController.js` - task logic, rendering, and user actions
- `src/StorageHandler.js`, `src/LocalStorageHandler.js`, `src/InMemoryStorageHandler.js`, `src/ArchiveStorageHandler.js`, `src/StorageGroup.js`, and `src/StorageFactory.js` - storage backends, composite, and factories
- `src/Task.js` and `src/TaskBuilder.js` - task creation
- `src/IdeaBox.js`, `src/IdeaBoxAdapter.js`, `src/LoggingTodoServiceDecorator.js`, and `src/ConfirmDeleteProxy.js` - suggestion adapter, logging decorator, and delete confirmation proxy
- `src/TaskObservers.js` - Observer-based open/done counter, updated on every saved task change
- `src/Commands.js` - Command-based history for undoing successful Add Task actions, newest first

## Week 11 behavior and checks

The counter shows saved tasks on startup and updates after adding, completing, deleting, or undoing
a task. Add Task (including Enter) records a command; Undo removes the latest successful regular
add after the existing delete confirmation. Add Urgent and Get Suggestion do not enter this history.
History lasts until the page reloads. As in the lab, canceling an Undo confirmation leaves the task
in place but consumes that history entry.

Run the automated behavior checks with Node.js: `node --test tests/week11.test.mjs`.

## License

MIT - see `LICENSE`.
