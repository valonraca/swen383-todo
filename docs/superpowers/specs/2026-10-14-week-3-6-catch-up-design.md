# Week 3–6 Todo App Catch-up Design

## Purpose

Bring the Week 2 Todo App forward through the published Week 3, Week 4/5, and Week 6 labs while preserving the app's existing behavior and maintaining a clear, defensible Git history. Course-download archives remain source material; the repository receives only source, diagrams, tests, and design rationale needed for the labs.

## Starting state

- `main` and `feat/solid-refactoring` both point to the Week 2 commit.
- `src/todo.js` contains persistence, task rules, rendering, event handling, task construction, and workload calculation in one module.
- Week 2 diagrams and `SMELLS.md` exist.

## Target design

### Week 3: SOLID refactor

- `TodoService` owns the task collection and task rules. It receives a storage object with `load()` and `save(tasks)`.
- `TodoRenderer` owns DOM rendering and markup creation.
- `LocalStorageHandler` owns the direct `localStorage` API calls.
- `main.js` is the composition root that creates and connects these objects.
- `src/todo.js` is deleted once the module split works.

This applies SRP by separating task, rendering, and persistence concerns, and DIP by injecting storage into the service.

### Week 4/5: GRASP responsibilities

- `TodoController` coordinates UI requests: it delegates mutations to `TodoService`, then asks `TodoRenderer` to render.
- `TodoRenderer` receives callback functions for Done and Delete actions rather than mutating the service directly.
- `TodoService.getWorkloadSummary()` calculates the status line because it owns the task data.

This applies Controller to UI events, Creator to task construction inside the service, and Information Expert to workload calculation.

### Week 6: Creational patterns

- `StorageHandler` defines the storage interface.
- `LocalStorageHandler` and `InMemoryStorageHandler` are concrete storage products.
- `StorageFactory` creates a `TodoService` using `createStorage()`; its concrete factories choose the storage backend.
- `TaskBuilder` builds `Task` objects. `TodoService` exposes `addTask(description)` and `addUrgentTask(description)` rather than branching on a task type.

This applies Factory Method to backend selection and Builder to normal/urgent task construction. The UI behavior remains: normal and urgent creation, Enter-to-add, completion, deletion, persistence through local storage, and status counts.

## Implementation sequence and Git history

1. Extract and organize the student-facing MyCourses download by week without modifying original source files.
2. On `feat/solid-refactoring`, document SOLID issues, refactor the module split, and commit the SRP and DIP work separately.
3. Merge the completed Week 3 branch to `main` as the Week 4 instructions require.
4. On `feat/grasp-controller`, document GRASP decisions, add the controller/callback wiring, then move workload calculation to `TodoService` in separate meaningful commits.
5. Preserve the Week 5 studio as the verification bridge for the Week 3/4 design, then merge the branch to `main`.
6. On `feat/creational-patterns`, add the Factory Method work and Builder work in separate meaningful commits, then merge it to `main`.

Where remote access is available, required GitHub Issues will be created with the published titles and rationale. No MyCourses submission is made.

## Testing and verification

- Add focused automated unit tests around service behavior, storage substitutions, task construction, and controller delegation before production changes where practical.
- Run the complete test command after each lab milestone.
- Run the app through a local HTTP server for browser-module smoke tests: normal task, urgent task, Enter, Done, Delete, status count, and storage persistence.
- Check the lab's required searches and file counts at each checkpoint.
- Record any limitation that prevents a required remote or browser verification.

## Risks and constraints

- The course expects GitHub Issues and a regular meaningful history, but the audit has not yet confirmed GitHub CLI authentication or repository Issue permissions.
- The course permits AI for learning and checking, but its use must be disclosed and the student must be able to defend every decision. The student will handle disclosure directly with the professor; no AI-disclosure text or artifact is added to the repository.
- The task will not submit or otherwise represent the work as the student's own without the student's explicit current-session request.
