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
- `src/main.js` - composition root: creates the objects and wires them together
- `src/TodoService.js` - owns the task list and its operations (no DOM)
- `src/TodoRenderer.js` - draws the lists and wires the row buttons
- `src/TodoController.js` - GRASP Controller: receives UI events and delegates
- `src/Task.js`, `src/TaskBuilder.js` - the task model and its Builder
- `src/StorageHandler.js`, `src/LocalStorageHandler.js`, `src/InMemoryStorageHandler.js`,
  `src/ArchiveStorageHandler.js` - storage backends
- `src/StorageFactory.js` - Factory Method for choosing storage
- `src/StorageGroup.js` - Composite: saves to several storage handlers at once
- `src/IdeaBox.js`, `src/IdeaBoxAdapter.js` - Adapter for task suggestions
- `src/LoggingTodoServiceDecorator.js` - Decorator that logs TodoService calls
- `src/ConfirmDeleteProxy.js` - Proxy that asks before deleting
- `src/TaskObservers.js` - Observer: task counter
- `src/Commands.js` - Command: undo for Add
- `docs/` - PlantUML class and sequence diagrams
- `SMELLS.md` - code smells found in the original code

## License

MIT - see `LICENSE`.
