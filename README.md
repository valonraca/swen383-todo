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
- `src/main.js` - creates the objects and connects the input controls
- `src/TodoService.js` - task data, validation, mutations, and workload summary
- `src/TodoRenderer.js` - task markup and page rendering
- `src/LocalStorageHandler.js` - loads and saves tasks in local storage
- `src/TodoController.js` - coordinates task actions between service and renderer
- `docs/class-diagram.puml` - current application classes and dependencies
- `docs/sequence-add-task.puml` - Add Task flow through controller, service, storage, and renderer

## Design

Week 3 separates task logic, rendering, and persistence (Single Responsibility Principle),
and injects the storage handler into `TodoService` (Dependency Inversion Principle).
Week 4 adds `TodoController` (GRASP Controller) and moves workload counting to the class
that owns the tasks, `TodoService` (GRASP Information Expert). The service also creates
the task objects it owns (GRASP Creator).

`TodoService.addTask()` returns the new task ID, or `null` for a description shorter than
three characters. The controller renders after a successful add. Normal and urgent tasks
still use the existing conditional branch for this week's exercise.

## Manual verification

With the app running through Live Server:

1. Add a normal task and an urgent task; check the labels and workload counts.
2. Press Enter in the input to add a task.
3. Try a description shorter than three characters; it should show an alert and add nothing.
4. Use Done, Undo, and Delete; check the lists, counts, and page title.
5. Reload the page and confirm the remaining tasks are restored.
6. Check the browser console for errors.

## License

MIT - see `LICENSE`.
