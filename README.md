# Todo App

I use this app to add normal and urgent tasks, mark them complete, undo completion and delete them. Get Suggestion adds an idea from IdeaBox, and the console logs each add attempt. My tasks are saved in browser localStorage. The app uses HTML, CSS and JavaScript with no build step.

This is my fork of the shared SWEN-383 Todo App.

## Running it

I open `index.html` with the VS Code Live Server extension. The JavaScript modules need an HTTP server, so I do not open the HTML file directly from the filesystem.

## Files

- `index.html` — page structure
- `style.css` — styling
- `src/TodoService.js` — tasks, validation and persistence through an injected handler
- `src/TodoRenderer.js` — DOM rendering
- `src/LocalStorageHandler.js` — browser storage
- `src/main.js` — startup and dependency wiring
- `src/TodoController.js` — coordinates UI actions
- `src/StorageHandler.js` — storage contract
- `src/InMemoryStorageHandler.js` — temporary storage
- `src/StorageFactory.js` — Factory Method creators for the two backends
- `src/Task.js` — task data
- `src/TaskBuilder.js` — constructs normal and urgent tasks
- `src/IdeaBox.js` — supplied suggestion provider
- `src/IdeaBoxAdapter.js` — converts an idea into task text
- `src/LoggingTodoServiceDecorator.js` — adds logging around the service
- `SMELLS.md` — my three findings from the original code
- `docs/class-diagram.puml` — the original app's structure
- `docs/sequence-add-task.puml` — the original successful Add a Task scenario

## License

MIT — see `LICENSE`.
