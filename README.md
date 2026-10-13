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
- `src/main.js` - creates and connects the objects; binds Add and Enter events
- `src/LocalStorageHandler.js` - loads and saves tasks
- `src/TodoService.js` - task data, rules and workload summary
- `src/TodoRenderer.js` - markup and list interactions
- `src/TodoController.js` - coordinates adding tasks and rendering
- `docs/` - Week 4 UML and [refactoring notes](docs/w3-w4-refactoring.md)
- `tests/` - behavior and DOM integration tests

## Week 3 and Week 4

Week 3 separates storage, rules and rendering (SRP) and injects the storage
dependency (DIP). Week 4 introduces an Add controller (GRASP Controller) and moves
the workload summary to the service (Information Expert). The urgent-task branch
is intentionally retained for Week 6.

The page now loads `src/main.js` as an ES module. Use Live Server or another HTTP
server; opening `index.html` directly as a local file will not load the modules.

## Tests

With Node.js 22.13+ (22.x) or Node.js 24+:

```sh
npm ci
npm test
```

jsdom is used only for tests. The browser application still uses plain JavaScript
and needs no installation or build step to run through Live Server.

## License

MIT - see `LICENSE`.
