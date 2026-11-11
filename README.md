# Todo App

A small browser Todo list: add tasks, get suggestions, mark them complete, and
confirm deletions. The active list and an archive are kept in browser storage.
Plain HTML, CSS and JavaScript, no build step.

This is the shared codebase for SWEN-383 (Software Design Principles and Patterns) at RIT Kosovo.
Every student forks this repository in Week 1 and evolves it, week by week, as the course covers
new design principles and patterns.

## Running it

Open `index.html` with a live-reloading server, such as the VS Code "Live Server" extension, and it
runs in your browser. Nothing to install beyond Git, a browser, and an editor.

## Files

- `index.html` - page structure
- `style.css` - styling
- `src/TodoService.js` - task data, validation, task creation, and workload summary
- `src/TodoRenderer.js` - page rendering and callback-based row actions
- `src/LocalStorageHandler.js` - browser persistence through `load()` / `save(tasks)`
- `src/TodoController.js` - coordinates Add, Done/Undo, and Delete
- `src/main.js` - creates dependencies and wires input events
- `src/StorageHandler.js` and `src/InMemoryStorageHandler.js` - shared storage base and temporary backend
- `src/StorageFactory.js` - Factory Method creator and concrete factory subclasses
- `src/Task.js` and `src/TaskBuilder.js` - task product and fluent construction
- `src/IdeaBox.js` and `src/IdeaBoxAdapter.js` - supplied idea source and string adapter
- `src/LoggingTodoServiceDecorator.js` - logs additions and delegates the service surface
- `src/ArchiveStorageHandler.js` and `src/StorageGroup.js` - archive leaf and Composite storage
- `src/ConfirmDeleteProxy.js` - guards deletion behind an OK/Cancel confirmation
- `SMELLS.md` - three findings from the original Week 1 source, with line citations
- `docs/` - PlantUML diagrams, SVG previews, and completion/verification notes

## Weekly checkpoints

This fork is [ymorina/swen383-todo](https://github.com/ymorina/swen383-todo).
The original starter is [valonraca/swen383-todo](https://github.com/valonraca/swen383-todo).

Git tags preserve each design stage: `coursework/starter`, `coursework/week1`,
`coursework/week2`, `coursework/week3`, `coursework/week4`, `coursework/week5`,
`coursework/week6`, `coursework/week7`, and `coursework/week9`.
The Week 2 tag contains the original-code diagrams; the diagrams on `main`
describe the current implementation. Use `git show coursework/week2:docs/class-diagram.puml`
to inspect the original diagram without changing the working tree.

The feature branches are `feat/solid-refactoring`, `feat/grasp-controller`,
`feat/w3-w4-refactor`, `feat/creational-patterns`, `feat/structural-patterns`,
and `feat/composite-proxy`.
See [docs/COURSEWORK.md](docs/COURSEWORK.md) for the weekly
deliverables and GitHub Issues, and [docs/VERIFICATION.md](docs/VERIFICATION.md)
for the behavioral checks performed.

Week 6 resolves the original OCP Issue through Builder-based task construction.
The default `ArchivingStorageFactory` saves through a group containing the active
list and archive handlers. `load()` reads only the active list, so archived
deletions do not reappear. `LocalStorageFactory` remains available for list-only
persistence; `InMemoryStorageFactory` creates a temporary list cleared on reload.
See [docs/PATTERNS.md](docs/PATTERNS.md) for pattern roles and design Issues.
Week 7's Get Suggestion button adds an adapted idea through the normal controller
path. The logging decorator prints add attempts in the browser console; completion,
deletion, and workload reads delegate to the wrapped service.
Week 9 puts `ConfirmDeleteProxy` in front of that decorated service. Cancel keeps
the task and makes no storage writes; OK removes it from the active list while
retaining its archive record. Inspect the archive in the browser console with
`JSON.parse(localStorage.getItem('todo-archive'))`. Each ID retains its first-saved
record; the archive is not an edit-history log or a restore interface.

Instructor review: [PR #46](https://github.com/valonraca/swen383-todo/pull/46).

Run the dependency-free domain tests with `node --test` from this directory.

The student handles the myCourses repository submission and team declaration;
teammates can be added to GitHub when their usernames are available.

## License

MIT - see `LICENSE`.
