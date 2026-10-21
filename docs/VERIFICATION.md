# Verification

## Browser behavior

The original starter and each changed design stage were run over HTTP in an
isolated headless Chrome session using Playwright. These checks passed:

1. Empty startup displays the correct status and pending-count title.
2. Short descriptions are rejected with the existing message, without storage
   writes or clearing the input.
3. Normal additions trim descriptions, clear input, and flash the row.
4. Urgent tasks preserve the prefix and high-priority styling.
5. Enter adds a normal task.
6. Tasks, completion state, and priority survive reloads.
7. Done updates the list, counts, and title; completion persists; Undo works.
8. Delete persists and updates the oldest pending description.
9. Display truncation retains the complete saved description.
10. Clearing the list persists; no application console or uncaught page errors
    were observed.

The harness supplies an empty favicon response because the static starter has
no favicon. It does not suppress application errors. An isolated browser profile
keeps these checks separate from the student's saved task list.

## Dependency substitution

The service loaded existing data, added urgent tasks, rejected invalid input
without saving, toggled completion, deleted tasks, and calculated counts using
an injected in-memory `load()`/`save(tasks)` object. Construction required no DOM
or concrete storage adapter. The existing invalid-input alert was stubbed for
this check. The adapter also round-tripped records under the original `todo-tasks`
key, preserving compatibility with the starter's saved data.

## Structural checks

- Week 6: ten JavaScript files directly in `src/`; no `todo.js`.
- `index.html` loads `src/main.js` as a module; imports use `./` and `.js`.
- Service storage is injected; no direct browser-storage or DOM/rendering reference.
- `main.js` delegates interactions to the controller.
- Renderer never calls task-mutating service methods or holds a controller.
- Controller delegates validation and task creation to the service.
- Workload counting belongs to the service; the original free helper is removed.
- All new tasks use TaskBuilder; normal and urgent methods share validation/store.
- Factory Method selects persistence without changing the service at its checkpoint.
- Both diagrams render as valid SVGs.

## Recheck

Open `index.html` with VS Code Live Server. Add normal and urgent tasks, press
Enter, click Done/Undo/Delete, and reload. Preview `.puml` files with Alt+D.
Original code and diagrams are preserved in the weekly Git tags.

Run `node --test` from the repository root for the storage-factory, builder,
validation, and controller tests. The browser suite also checked in-memory reload
behavior and compatibility with local tasks saved by earlier versions.

The automated harness and per-stage reports/screenshots live in the parent
workspace's `coursework-tools/` directory. They are verification tools, not
runtime dependencies; the Todo App still has no build step.
