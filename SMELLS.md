## 1. God Object, src/todo.js
**Where:** src/todo.js, lines 14-96 (class TodoManager)
**Smell:** God Object. It stores tasks, validates input,
writes to localStorage and renders the list into the DOM.
**Cost:** Four unrelated reasons to change this file. Adding a
second storage option means editing the same class that owns
validation, so a storage bug can break validation.
**Not yet fixing:** noted for Week 3.

## 2. Long Parameter List, src/todo.js
**Where:** src/todo.js, lines 124-140 
**Smell:** Long Parameter List. The function has
id, desc, completed, priority, createdAt and showActions
as parameters

## 3. Long Method, src/todo.js
**Where:** src/todo.js, lines 18-46 (class TodoManager)
**Smell:** Funnction is quite long

## 4. Feature Envy, src/todo.js
**Where:** src/todo.js, lines 143-156 
**Smell:** This function lives off of data from manager.tasks

## 5. Duplicated Code, src/todo.js
**Where:** src/todo.js, lines 62-78 
**Smell:** The code for renderPendingRows and renderCompletedRows
is almost identcal, it changes only in the boolean, where they have the 
opposite value there



