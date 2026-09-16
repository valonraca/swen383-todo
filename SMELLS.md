## 1. God Object, src/todo.js
**Where:** src/todo.js, lines 2-121 (class TodoManager)
**Smell:** God Object. It handles task data management, persistence (localStorage), and complex DOM rendering/event binding in a single class.

## 2. Long Method, src/todo.js
**Where:** src/todo.js, lines 80-120 (render method)
**Smell:** Long Method. The render function performs multiple tasks including HTML generation, finding specific data points, DOM manipulation, manual event listener attachment, and UI animation logic.

## 3. Long Parameter List, src/todo.js
**Where:** src/todo.js, line 124 (buildTaskRow function)
**Smell:** Long Parameter List. The function accepts six individual arguments to represent a task's state rather than passing a single task object.

## 4. Duplicated Code, src/todo.js
**Where:** src/todo.js, lines 62-78 (renderPendingRows and renderCompletedRows)
**Smell:** Duplicated Code. Both methods contain nearly identical loop logic and function calls, differing only in their filtering condition.

## 5. Feature Envy, src/todo.js
**Where:** src/todo.js, lines 143-160 (summarizeWorkload function)
**Smell:** Feature Envy. An external function that exists solely to query and process the internal data of the TodoManager class.

## 6. Magic Numbers, src/todo.js
**Where:** src/todo.js, lines 20, 25, 115, and 125
**Smell:** Magic Numbers. Hardcoded literals (3, 20, 1500, 40) are used for validation limits, UI timing, and string manipulation without descriptive constant names.

## All Smells **not yet addressed**, Noted for Week 3.
