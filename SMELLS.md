## 1. God Object, src/todo.js
**Where:** src/todo.js, lines 2-121 (class TodoManager)
**Smell:** God Object. It handles task data management, persistence (localStorage), and complex DOM rendering/event binding in a single class.

## 2. Long Method, src/todo.js
**Where:** src/todo.js, lines 80-120 (render)
**Smell:** Long Method. The render function performs multiple tasks including HTML generation, finding specific data points, DOM manipulation, manual event listener attachment, and UI animation logic.

## 3. Long Parameter List, src/todo.js
**Where:** src/todo.js, line 124 (buildTaskRow)
**Smell:** Long Parameter List. The function accepts six individual arguments to represent a task's state rather than passing a single task object.

## All Smells addressed in Week 3 and Week 4 refactors.
- **God Object**: Split into `TodoService`, `TodoRenderer`, `TodoController`, and `LocalStorageHandler`.
- **Long Method**: `render` logic decomposed and moved to `TodoRenderer`.
- **Long Parameter List**: Task state handled via service and specific renderer methods.
