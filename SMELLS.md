# Code Smell Audit

This document records code smells found in `src/todo.js`. The findings are based primarily on the smell definitions used in class.

## 1. God Object, `src/todo.js`

**Where:** `src/todo.js`, lines 2-121 (`TodoManager` class)

**Smell:** God Object. `TodoManager` does far more than one job. It stores task data, validates input, creates and mutates tasks, reads and writes localStorage, renders HTML, queries the DOM, attaches event listeners, triggers animations, and updates document.title.

**Cost:** The class has many unrelated reasons to change. A change to storage, validation, task behavior, or page structure can all require editing the same class. As the application grows, unrelated changes become more likely to affect each other, making the code harder to test, debug, and extend safely.

**Not yet fixing:** noted for Week 3.

---

## 2. Long Method, `src/todo.js`

**Where:** `src/todo.js`, lines 80-120 (`render`)

**Smell:** Long Method. `render()` performs many separate operations: it renders pending and completed tasks, finds the oldest pending task, builds the main HTML, finds buttons in the DOM, attaches event listeners, handles the flash animation for newly added tasks, counts pending tasks, and updates the browser title.

**Cost:** A change to the page markup can also require changes to event registration, animation logic, and other parts of the same method. This makes `render()` increasingly difficult to understand and increases the chance of breaking unrelated UI behavior when changing one part of the interface.

**Not yet fixing:** noted for Week 3.

---

## 3. Feature Envy, `src/todo.js`

**Where:** `src/todo.js`, lines 143-159 (`summarizeWorkload`)

**Smell:** Feature Envy. `summarizeWorkload(manager)` spends most of its work inspecting another object's data. It directly reads `manager.tasks` and then depends on each task's `completed` and `priority` properties.

**Cost:** Internal implementation changes to `TodoManager` can spread into unrelated functions outside the class. This increases the number of places that must change together and makes refactoring the task model more expensive.

**Not yet fixing:** noted for Week 3.

---

## 4. Duplicated Code, `src/todo.js`

**Where:** `src/todo.js`, lines 62-78 (`renderPendingRows` and `renderCompletedRows`)

**Smell:** Duplicated Code. `renderPendingRows()` and `renderCompletedRows()` contain almost the same loop. Both create an HTML string, iterate through `this.tasks`, filter by completion state, call `buildTaskRow()` with the same arguments, and return the resulting HTML. The main difference is that the completion condition is reversed.

**Coupling & Cohesion:** Each method is individually cohesive, but the two methods are **implicitly coupled through duplication** because they must continue to implement the same rendering behavior in parallel. A change to task-row rendering or filtering logic may need to be repeated in both methods.

**Cost:** If one method is updated and the other is missed, the pending and completed sections can slowly develop different behavior even though they should follow the same rules. This increases maintenance effort and the risk of inconsistent UI behavior.

**Not yet fixing:** noted for Week 3.