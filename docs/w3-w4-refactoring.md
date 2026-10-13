# Week 3 / Week 4 refactoring notes

This follows the W5 lab guide, starting from the existing Week 1 implementation.
The two local refactoring checkpoints record the Week 3 split followed by the
Week 4 controller and workload summary changes. Browser uploads may add separate
file-management commits around those checkpoints.

| Original problem | Change | Principle |
| --- | --- | --- |
| One `TodoManager` handled persistence, rules and markup. | Extract `LocalStorageHandler`, `TodoService` and `TodoRenderer`. | SOLID Single Responsibility: each class has a focused reason to change. |
| Business rules called a concrete browser storage API directly. | Inject an object with `load()` and `save(tasks)` into `TodoService`; choose the concrete adapter in `main.js`. | SOLID Dependency Inversion: the service depends on a small storage contract. |
| The startup code coordinated both adding and rendering. | Route Add Task, Add Urgent and Enter through `TodoController`. | GRASP Controller: a non-UI object coordinates the Add use case. |
| A free helper inspected another object's task array to calculate counts. | Put `getWorkloadSummary()` on `TodoService`. | GRASP Information Expert: the object owning the data performs the calculation. |

The service returns a new task ID after a successful add, or `null` for invalid
input. The controller renders only on success, and `main.js` then clears the
input. Done, Undo and Delete remain wired by the renderer, as specified in the
guide. The existing `todo-tasks` storage key and task object shape are unchanged.

## Deliberate scope limits

The `if (type === 'urgent')` branch remains for Week 6. The row-building helper
keeps its original body and parameter list. The two list loops, existing
validation alert and console warning, HTML interpolation and timestamp IDs are
also retained from the exercise. This is the requested incremental refactor,
not a claim that every remaining design or robustness concern is resolved.

## Verification

Run `npm ci` and `npm test` with Node.js 22.13+ (22.x) or Node.js 24+. Service/controller tests use
substitute storage and renderer objects. The DOM integration test uses jsdom to
exercise the real `main.js` entry point and page handlers, including a fresh
page/service with the saved task data. The browser app itself has no runtime
dependency or build step.

For a manual browser check, serve `index.html` with VS Code Live Server:

- Add a normal task, add an urgent task, and add a task with Enter.
- Reject a short description without clearing the input.
- Mark tasks Done, Undo them and Delete them; check both lists and counts.
- Reload and verify that tasks remain; check the console for errors.
- Confirm the new-task highlight, pending count in the tab title and oldest
  pending label still behave as before.

The final `src/` directory has exactly five JavaScript files and no `todo.js`.
The service contains no storage API, document access or render calls.
The entry point contains no direct service-add or renderer-render calls.

## UML

- [Class diagram](class-diagram.puml)
- [Add-task sequence diagram](sequence-add-task.puml)

These describe the final Week 4 implementation. Earlier UML exercises in
`plant uml/` and the original smell analysis in `SMELLS.md` are preserved.
