# Todo App

I use this app to add normal and urgent tasks, mark them complete, undo completion and delete them. My tasks are saved in browser localStorage. The app uses HTML, CSS and JavaScript with no build step.

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
- `SMELLS.md` — my three findings from the original code
- `docs/class-diagram.puml` — the original app's structure
- `docs/sequence-add-task.puml` — the original successful Add a Task scenario

## License

MIT — see `LICENSE`.
