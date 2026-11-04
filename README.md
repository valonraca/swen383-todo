# Todo App

A small browser Todo list with normal and urgent tasks, completion controls, and
deletion. Tasks use browser local storage by default. Plain HTML, CSS, and
JavaScript; no build step.

This repository is the SWEN-383 Software Design Principles and Patterns Todo app
at RIT Kosovo. The Week 6 lab adds Factory Method for storage creation and Builder
for task construction.

## Running it

Open `index.html` through an HTTP server, such as the VS Code Live Server
extension. The JavaScript modules require serving the files rather than opening
the page directly with a `file:` URL.

## Files

The app has ten JavaScript files in `src/`:

| File | Responsibility |
| --- | --- |
| `main.js` | Selects a storage factory, creates the app objects, and connects input controls. |
| `TodoService.js` | Owns task data, validates input, builds and stores tasks, and counts workload. |
| `TodoRenderer.js` | Renders task lists, urgent styling, status, and action buttons. |
| `TodoController.js` | Coordinates normal/urgent creation, completion, deletion, and rendering. |
| `StorageHandler.js` | Defines the storage Product contract: `load()` and `save(tasks)`. |
| `LocalStorageHandler.js` | Persists tasks under the `todo-tasks` browser storage key. |
| `InMemoryStorageHandler.js` | Keeps tasks in an array for the lifetime of the current backend instance. |
| `StorageFactory.js` | Contains the Creator and both ConcreteCreators for storage. |
| `Task.js` | Represents a finished task with the fields expected by storage and rendering. |
| `TaskBuilder.js` | Assembles tasks from a description and optional priority and label. |

`index.html` defines the page and `style.css` provides its styling. Editable design
sources are in `docs/`:

- [Class diagram](docs/class-diagram.puml)
- [Add Task sequence](docs/sequence-add-task.puml)

## Design

The earlier design separates task logic, rendering, and persistence (Single
Responsibility Principle), injects persistence into `TodoService` (Dependency
Inversion Principle), and uses `TodoController` as the GRASP Controller.
`TodoService` owns the tasks and computes their workload (GRASP Information Expert).

### Factory Method

| Pattern role | Class or method |
| --- | --- |
| Product | `StorageHandler` |
| ConcreteProduct | `LocalStorageHandler`, `InMemoryStorageHandler` |
| Creator | `StorageFactory`, whose `createService()` injects the selected storage into `TodoService` |
| ConcreteCreator | `LocalStorageFactory`, `InMemoryStorageFactory` |
| Factory method | `createStorage()` |

`main.js` creates `LocalStorageFactory` and calls `createService()`. The inherited
operation calls the subclass's `createStorage()` to select the backend. The base
storage operations and factory method throw until subclasses override them.
The Factory Method commit leaves `TodoService.js` unchanged; the later Builder
commit changes its task construction.

To try temporary storage, change both references to `LocalStorageFactory` in
`src/main.js` to `InMemoryStorageFactory`: the import and the constructor call.
Reload, add a task, and reload again. The temporary task disappears because a new
backend instance starts empty. Switch both references back to
`LocalStorageFactory` before committing. The default backend restores tasks on
reload; the in-memory backend does not erase existing local storage.

Design issue: [Factory Method for storage backends #7](https://github.com/granitllugiqi/swen383-todo/issues/7).

### Builder

`Task` is the Product and `TaskBuilder` is the Builder. A description is required;
priority defaults to `normal`. `setPriority()` and `addLabel()` return the builder
for chaining, and `build()` returns a `Task`.

```js
new TaskBuilder(trimmed).build();
new TaskBuilder(trimmed).setPriority('high').addLabel('URGENT').build();
```

The service exposes `addTask(description)` and `addUrgentTask(description)`.
Both share `validate()` and `store()`, and return the new task ID or `null` for
invalid input. The service, controller, and input handlers no longer pass a task
type string. Every new task uses the builder. The fields remain `id`, `desc`,
`completed`, `priority`, and `createdAt`, so the renderer and stored records keep
their existing format.

Design issue: [Builder for Task #8](https://github.com/granitllugiqi/swen383-todo/issues/8).

## Manual verification

With the app running through an HTTP server:

1. Add a normal task and an urgent task; check the labels, urgent styling, and counts.
2. Press Enter in the input to add a normal task.
3. Try a description shorter than three characters; an alert appears, nothing is
   added, and the input is preserved.
4. Use Done, Undo, and Delete; check both lists, the workload summary, and page title.
5. Reload with `LocalStorageFactory`; the remaining tasks are restored.
6. Temporarily select `InMemoryStorageFactory`; tasks disappear on reload.
7. Restore `LocalStorageFactory` and check the browser console for errors.

## License

MIT - see `LICENSE`.
