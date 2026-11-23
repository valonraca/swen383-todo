## 1.God Object, src/todo.js
Where: src/todo.js, lines 14-96 (class TodoManager)
Smell: God Object. It stores tasks, validates input,
writes to localStorage and renders the list into the DOM.
Cost: Four unrelated reasons to change this file. Adding a
second storage option means editing the same class that owns
validation, so a storage bug can break validation.
Not yet fixing: noted for Week 3.

## 2.Long Method, src/todo.js
Where: src/todo.js, lines 80-121 (render method inside TodoManager)
Smell: Long Method. A massive method spanning nearly 50 lines that handles HTML generation, DOM querying, event listener attachment, timer logic, and browser title updates all at once.

## 3.Long Parameter List, src/todo.js
Where: src/todo.js, lines 124-140 (buildTaskRow)
Smell: Long Parameter List. The function accepts six separate arguments (id, desc, completed, priority, createdAt, showActions).

## 4.Duplicated Code, src/todo.js
Where: src/todo.js, lines 62-78 (renderPendingRows and renderCompletedRows)
Smell: Duplicated Code. Both functions share identical loop and markup generation logic, separated only by an inverted completion check.

## 5.Magic Number Code, src/todo.js
Where: src/todo.js, lines 18-27 and lines 124-133 (addTask method, buildTaskRow function)
Smell: Magic Number. These conditional statements use numbers that make sense to the person who wrote them, but not to anyone else simply reading the code. 3 and 20 are numbers that can raise questions for developers reading this codebase, and the number 40 in buildTaskRow leaves anyone reading it wondering why 40.