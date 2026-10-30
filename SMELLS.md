## 1. God Object, src/todo.js
**Where:** src/todo.js, lines 2-121 (class TodoManager)
**Smell:** God Object. One class loads tasks, adds tasks, toggles tasks complete, delete tasks, renders pending rows, and renders completed rows.

## 2. Long Parameter List, src/todo.js
**Where:** src/todo.js, lines 124-140 (function buildTaskRow)
**Smell:** Long Parameter List. It has a total of 6 parameters (id, desc, completed, priority, createdAt, showActions) which is considered a long parameter list.

## 3. Magic Numbers, src/todo.js
**Where:** src/todo.js, lines 20, 25, 115, 125 (function addTask, function addTask, if(justAddedId), function buildTaskRow)
**Smell:** Magic numbers. There are no comments explaining why numbers like 3, 20, 1500, and 40 were chosen respectively. One can guess, but one can also assume these numbers are literals living in the head of whom wrote the code.

## 4. Duplicated Code, src/todo.js
**Where:** src/todo.js, lines 62-78 (function renderPendingRows, function renderCompletedRows)
**Smell:** Duplicated Code. Both functions follow identical structure and only differ in one respective line (task.completed & !task.completed). These functions can be simplified so they do not "duplicate code" from one another.

## 5. Feature Envy, src/todo.js
**Where:** src/todo.js, lines 143-160 (function summarizeWorkload)
**Smell:** Feature Envy. This function is not definied within the class TodoManager, but it is almost entirely dependent on the data of the object of that class.