## 1. God Object, src/todo.js
**Where:** src/todo.js, lines 14-116 (class TodoManager)
**Smell:** God Object. It stores tasks, validates input,
writes to localStorage, binds UI events, and renders the DOM.
**Not yet fixing:** noted for Week 3.

## 2. Long Method / Complex Method
**Where:** src/todo.js, lines 69-110 (`render`)
**Smell:** The `render()` method does too much at once: it builds
both lists, computes the oldest pending item, updates the status,
rewires button listeners, and adds animation logic.

## 3. Duplicate Code
**Where:** src/todo.js, lines 43-55 and 57-67 (`renderPendingRows`,
`renderCompletedRows`)
**Smell:** The two methods follow nearly the same pattern and both
build task rows with the same structure.

## 4. Tight Coupling to the DOM and Browser APIs
**Where:** src/todo.js, lines 4-12, 20-30, 73-91, 111-116
**Smell:** The app logic reaches directly into `document`,
`localStorage`, and `window` instead of separating data concerns from
UI/browser concerns.

## 5. Magic Strings / Primitive Obsession
**Where:** src/todo.js, lines 22, 28, 38, 47-49, 87-115
**Smell:** Values like `'todo-tasks'`, `'urgent'`, `'simple'`,
`'high'`, `'normal'`, and `'completed'` are scattered through the code.

## 6. Feature Envy
**Where:** `buildTaskRow()` and `summarizeWorkload()` in src/todo.js,
lines 94-116
**Smell:** These helper functions are too familiar with the manager's
internal structure. They know task field names and UI behavior instead
of interacting through a cleaner abstraction.

## 7. Hidden Side Effects and Fragile Validation
**Where:** src/todo.js, lines 22-31 (`addTask`)
**Smell:** Validation is mixed into the same method that mutates task
state. A UI alert is used directly inside the core logic, and the
decision logic is not isolated from the presentation layer.

## 8. Shotgun Surgery Risk
**Where:** src/todo.js throughout
**Smell:** If the app needs to change how tasks are stored, displayed,
or categorized, the same class must be edited in many places.

## 9. Inconsistent Responsibility Boundaries
**Where:** src/todo.js, lines 1-116
**Smell:** The file mixes model behavior, persistence, rendering,
state inspection, and event binding in one place.