# Week 3–6 Todo App Catch-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Organize the published course materials and evolve the Week 2 Todo App through the Week 3–6 lab checkpoints with testable, defensible commits.

**Architecture:** First split the monolithic `TodoManager` into task, rendering, and storage responsibilities. Add a thin GRASP controller between DOM events and the service, then use Factory Method to choose a storage backend and Builder to create task objects without a type-switch branch.

**Tech Stack:** Browser JavaScript modules, HTML/CSS, PlantUML, Git/GitHub, Node.js 24 built-in test runner; no runtime package dependencies.

**Spec:** `docs/superpowers/specs/2026-10-14-week-3-6-catch-up-design.md`

## Global Constraints

- Preserve the downloaded course archive and organize only student-facing materials by week; do not overwrite existing source files.
- Do not submit anything to MyCourses.
- Keep required Git history meaningful and use the published feature branch names.
- Create the published GitHub Issues when the repository permits it; do not add AI-disclosure text or artifacts to the repository.
- Preserve normal task, urgent task, Enter-to-add, Done, Delete, status-count, and local-storage persistence behavior.
- Use TDD for application logic: each production behavior begins with a focused failing Node test.

## Review Focus

- A description shorter than three characters must not create or persist a task; Task 2 test covers this.
- An urgent task must remain labelled `[URGENT]` and have high priority after construction; Task 5 test covers this.
- Deleting or toggling a nonexistent ID must leave the task list and persisted data unchanged; Task 2 test covers this.
- `InMemoryStorageHandler` must not retain tasks after a fresh handler is constructed, while local storage remains the default backend; Task 4 test covers this.
- Renderer action callbacks must route through the controller, not mutate the service directly; Task 3 test and browser smoke check cover this.

---

### Task 1: Organize source materials and establish test support

**Files:**
- Create: `../../materials/week-01/` through `../../materials/week-06/` in the course folder (outside this Git repository)
- Modify: `../../materials/SOURCE_LIBRARY.md` in the course folder (outside this Git repository)
- Create: `package.json`
- Create: `tests/helpers.js`

**Interfaces:**
- Produces: `npm test` runs `node --test tests`; `createMemoryStorage(initialTasks = [])` returns `{ load(), save(tasks), savedTasks }` for service tests.

- [ ] **Step 1: Extract the outer course archive without modifying it**

Copy the outer ZIP into a dated source-archive folder and extract each inner archive into `materials/week-01` through `materials/week-06`. Preserve original filenames and retain `Table of Contents.html` with its week. Do not overwrite the existing Week 1 material folder.

- [ ] **Step 2: Update the course source index**

Record the download date, archive name, and the Week 1–6 student-facing lecture/lab files in `materials/SOURCE_LIBRARY.md`.

- [ ] **Step 3: Add a failing test-runner check**

Create `package.json` with `"type": "module"` and a `test` script of `node --test tests`. Add `tests/helpers.js` and a temporary `tests/helpers.test.js` that expects a fresh fake storage to load an empty task list.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`

Expected: the helper-storage test passes with no dependencies installed.

- [ ] **Step 5: Commit the material organization and test harness**

```bash
git add package.json tests
git commit -m "test: add Todo App test harness"
```

### Task 2: Week 3 SOLID refactor

**Files:**
- Create: `src/LocalStorageHandler.js`, `src/TodoService.js`, `src/TodoRenderer.js`, `src/main.js`, `tests/TodoService.test.js`
- Modify: `index.html`, `SMELLS.md`
- Delete: `src/todo.js`

**Interfaces:**
- Consumes: a storage object implementing `load() -> Task[]` and `save(tasks: Task[]) -> void`.
- Produces: `TodoService(storage)`, `addTask(description, type) -> number | null`, `toggleComplete(id) -> void`, and `deleteTask(id) -> void`; `TodoRenderer(containerId).render(service, justAddedId?) -> void`.

- [ ] **Step 1: File the SOLID Issues before code changes**

Create GitHub Issues for the SRP, DIP, and OCP violations identified in `src/todo.js`. The SRP and DIP descriptions name the exact methods and consequences; the OCP Issue records that the `type === 'urgent'` branch remains open until Week 6.

- [ ] **Step 2: Write failing `TodoService` tests**

In `tests/TodoService.test.js`, specify that a valid normal task is stored and returns an ID, a short description returns `null` without saving, toggling changes only the matching task, and deleting removes only the matching task.

- [ ] **Step 3: Run the focused tests to verify RED**

Run: `node --test tests/TodoService.test.js`

Expected: FAIL because `TodoService.js` does not exist.

- [ ] **Step 4: Implement the SRP/DIP module split**

Create `LocalStorageHandler`, `TodoService`, `TodoRenderer`, and `main.js` using the published Week 3 interfaces. Move markup helpers into the renderer, make `main.js` the only composition root, replace the classic script tag with `<script type="module" src="src/main.js">`, and delete `src/todo.js`. Preserve the urgent branch for Week 6.

- [ ] **Step 5: Run service tests and required static checks**

Run: `npm test`; then search `TodoService.js` for `localStorage`, `document`, and `render`.

Expected: all tests pass; each search has zero results.

- [ ] **Step 6: Commit the SRP work and close its Issue**

```bash
git add src/TodoService.js src/TodoRenderer.js src/main.js index.html tests/TodoService.test.js
git commit -m "refactor: split TodoManager into TodoService and TodoRenderer\n\nFixes #<srp-issue>"
```

- [ ] **Step 7: Commit the DIP work and close its Issue**

```bash
git add src/LocalStorageHandler.js src/TodoService.js src/main.js src/todo.js
git commit -m "refactor: extract LocalStorageHandler, inject into TodoService\n\nFixes #<dip-issue>"
```

### Task 3: Week 4/5 GRASP controller and Information Expert

**Files:**
- Create: `src/TodoController.js`, `tests/TodoController.test.js`
- Modify: `src/TodoRenderer.js`, `src/TodoService.js`, `src/main.js`

**Interfaces:**
- Consumes: `TodoService` methods from Task 2 and a renderer exposing `render(service, justAddedId?)` and `bindActions({ onToggle, onDelete })`.
- Produces: `TodoController(service, renderer)`, `start()`, `addTask(description, type)`, `toggleTask(id)`, `deleteTask(id)`, and `TodoService.getWorkloadSummary() -> string`.

- [ ] **Step 1: File the three GRASP Issues**

Create Issues identifying Controller for UI-event coordination, Creator for task construction in `TodoService`, and Information Expert for workload calculation. Add a comment to the Creator Issue once the controller and `main.js` are confirmed not to construct task objects.

- [ ] **Step 2: Write failing controller tests**

In `tests/TodoController.test.js`, use a stub service and renderer to assert that `start()` renders once, a successful add delegates then renders with the returned ID, an invalid add does not render, and toggle/delete delegate then re-render.

- [ ] **Step 3: Run the focused tests to verify RED**

Run: `node --test tests/TodoController.test.js`

Expected: FAIL because `TodoController.js` does not exist.

- [ ] **Step 4: Implement the controller and renderer callback boundary**

Add `TodoController`, bind `onToggle` and `onDelete` callbacks from its constructor, and route all DOM add/toggle/delete actions through it. The renderer reads the service only to display it.

- [ ] **Step 5: Move the workload calculation to its information expert**

Implement `TodoService.getWorkloadSummary()`, replace the renderer call, and remove the free `summarizeWorkload` function.

- [ ] **Step 6: Run the full suite and static checks**

Run: `npm test`; search the project for `summarizeWorkload`; search `src/main.js` for `service.addTask` and `renderer.render`.

Expected: all tests pass; each search has zero results.

- [ ] **Step 7: Commit in the lab’s three increments**

```bash
git add src/TodoController.js src/main.js tests/TodoController.test.js
git commit -m "feat: introduce TodoController to handle UI events"
git add src/TodoRenderer.js src/TodoController.js
git commit -m "refactor: route Done and Delete through TodoController"
git add src/TodoService.js src/TodoRenderer.js
git commit -m "refactor: move summarizeWorkload onto TodoService (Information Expert)"
```

### Task 4: Week 6 Factory Method

**Files:**
- Create: `src/StorageHandler.js`, `src/InMemoryStorageHandler.js`, `src/StorageFactory.js`, `tests/StorageFactory.test.js`
- Modify: `src/LocalStorageHandler.js`, `src/main.js`

**Interfaces:**
- Consumes: `TodoService(storage)` from Task 2.
- Produces: `StorageHandler.load()`, `StorageHandler.save(tasks)`, `StorageFactory.createService() -> TodoService`, `LocalStorageFactory.createStorage()`, and `InMemoryStorageFactory.createStorage()`.

- [ ] **Step 1: Write failing factory and in-memory tests**

In `tests/StorageFactory.test.js`, assert that `InMemoryStorageHandler` saves then loads a task within one instance but a fresh instance is empty, and that `InMemoryStorageFactory.createService()` returns a `TodoService` using an in-memory backend.

- [ ] **Step 2: Run the focused tests to verify RED**

Run: `node --test tests/StorageFactory.test.js`

Expected: FAIL because the factory and in-memory modules do not exist.

- [ ] **Step 3: Implement the Factory Method roles**

Create the abstract `StorageHandler`, make `LocalStorageHandler` and `InMemoryStorageHandler` concrete products, and add `StorageFactory`, `LocalStorageFactory`, and `InMemoryStorageFactory`. Update `main.js` to receive its service from `new LocalStorageFactory().createService()`.

- [ ] **Step 4: Run tests and Factory Method checks**

Run: `npm test`; search `src/main.js` for `new LocalStorageHandler`; compare `TodoService.js` to its pre-Factory commit.

Expected: all tests pass; no direct handler construction appears in `main.js`; `TodoService.js` is unchanged by the Factory task.

- [ ] **Step 5: Commit and file the Factory Method Issue**

```bash
git add src/StorageHandler.js src/InMemoryStorageHandler.js src/StorageFactory.js src/LocalStorageHandler.js src/main.js tests/StorageFactory.test.js
git commit -m "feat: StorageFactory (Factory Method) for swappable storage"
```

Create `[Design] Factory Method for storage backends` documenting Product, ConcreteProduct, Creator, ConcreteCreator, and Factory Method with the implemented class names.

### Task 5: Week 6 Builder pattern and OCP closure

**Files:**
- Create: `src/Task.js`, `src/TaskBuilder.js`, `tests/TaskBuilder.test.js`
- Modify: `src/TodoService.js`, `src/TodoController.js`, `src/main.js`, `tests/TodoService.test.js`

**Interfaces:**
- Consumes: `TodoService.store(task) -> number` and `TodoController` from Task 3.
- Produces: `Task(builder)`, `TaskBuilder(desc).setPriority(priority).addLabel(label).build() -> Task`, `TodoService.addTask(description)`, and `TodoService.addUrgentTask(description)`.

- [ ] **Step 1: Write failing Builder and service tests**

In `tests/TaskBuilder.test.js`, assert that a normal builder creates a normal task and a chained urgent builder creates `[URGENT]` text with `high` priority. Extend `tests/TodoService.test.js` to require `addTask(description)` and `addUrgentTask(description)` to persist their respective task shapes without a type argument.

- [ ] **Step 2: Run focused tests to verify RED**

Run: `node --test tests/TaskBuilder.test.js tests/TodoService.test.js`

Expected: FAIL because `Task.js`, `TaskBuilder.js`, and the no-type service methods do not exist.

- [ ] **Step 3: Implement Task and TaskBuilder**

Create `Task` with the existing task field names and `TaskBuilder` with `setPriority`, `addLabel`, and `build`. Each fluent modifier returns the builder.

- [ ] **Step 4: Replace the service type branch and update callers**

Replace `addTask(description, type)` with `addTask(description)` and `addUrgentTask(description)`. Extract shared `validate(description)` and `store(task)` methods, then update the controller and `main.js` so neither passes a type string.

- [ ] **Step 5: Run all tests and Builder checks**

Run: `npm test`; search the project for `type ===`; search `src/TodoService.js` for `desc: trimmed`.

Expected: all tests pass; both searches return zero results.

- [ ] **Step 6: Commit, document the pattern, and close the OCP Issue**

```bash
git add src/Task.js src/TaskBuilder.js src/TodoService.js src/TodoController.js src/main.js tests
git commit -m "feat: TaskBuilder (Builder) replaces the urgent-task branch\n\nFixes #<ocp-issue>"
```

Create `[Design] Builder for Task, removes the urgent-task branch` naming Product and Builder.

### Task 6: Browser checks, diagrams, and required merges

**Files:**
- Modify: `docs/class-diagram.puml`, `docs/sequence-add-task.puml`

**Interfaces:**
- Consumes: the final Week 6 module structure from Tasks 2–5.
- Produces: diagrams that describe the final source code and an up-to-date `main` branch with ten `src/` files.

- [ ] **Step 1: Perform a browser-module smoke test**

Serve the repository through a local HTTP server. Verify normal task, urgent task, Enter-to-add, Done, Delete, workload status, local-storage persistence, and browser console with no errors. Temporarily select `InMemoryStorageFactory`, verify a reload loses its data, then restore `LocalStorageFactory` before committing.

- [ ] **Step 2: Update both PlantUML diagrams to match the final code**

The class diagram includes the service, controller, renderer, storage abstraction/products/factories, Task, and TaskBuilder. The sequence diagram follows the final Add Urgent interaction through controller, service, builder, storage, and renderer.

- [ ] **Step 3: Verify diagrams and final checkpoint**

Render both diagrams. Run `npm test`, confirm the ten required source files, and confirm `git status` has only the diagram changes intended for commit.

- [ ] **Step 4: Commit diagrams and execute the published merge sequence**

Commit updated diagrams with `docs: update UML for Week 6 architecture`. Push each feature branch, merge Week 3 into `main` before Week 4/5 work, merge the completed Week 4/5 branch into `main`, then merge `feat/creational-patterns` into `main` and push. Do not create a MyCourses submission.

## Self-review

- The material organization, Weeks 3–6 code changes, GitHub Issues, commit history, browser behavior, diagrams, and branch merges each have a task.
- `TodoService`, controller, storage factories, and task builder use consistent interfaces across tasks.
- All five review-focus conditions are covered by specified test or browser-check steps.
- The plan avoids new runtime dependencies and preserves the course’s no-build-step browser workflow.
