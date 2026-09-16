## 1. God Object, src/todo.js
**Where:** src/todo.js, lines 14-96 (class TodoManager)
**Smell:** God Object. It stores tasks, validates input,
writes to localStorage and renders the list into the DOM.

## 2. Long Parameter List, src/todo.js
**Where:** src/todo.js, lines 124 - 140 (function buildTaskRow)
**Smell:** Long Parameter. This function contain more than 4 parameters (id, desc, completed, priority, createdAt, ShowActions) which falls into the long parameter category. 

## 3. Duplicated Code, src/todo.js
**Where:** src/todo.js, lines 62-78 (function renderPendingRows, renderCompletedRows)
**Smell:** Duplicated code. Both of these functions have the same logic, written twice, slightly differently, and the change is simply the condition statement. Everything else is the same, the html is saved the same and returned with all identical variables.


## 4. Magic Number Code, src/todo.js
**Where:** src/todo.js, lines 18-27 and lins 124-133 (function addTask, function BuildTaskRow)
**Smell:** Magic Numer. These both condition statements use a number in which could make sense for the person who wrote it, but not for anyone else simply reading. 3 and 20 are numbers that can raise questions for developers reading this codebase, and the number 40 on the function buildTaskRow also would leave any one reading wondering why 40
