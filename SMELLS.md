## 1. God Object, src/todo.js
Where: src/todo.js, lines 14-96 (class TodoManager)
Smell: God Object. It stores tasks, validates input,
writes to localStorage and renders the list into the DOM.
Cost: Four unrelated reasons to change this file. Adding a
second storage option means editing the same class that owns
validation, so a storage bug can break validation.
Not yet fixing: noted for Week 3.

## 2. Duplicated Code, src/todo.js
Where: src/todo.js, lines 62-78 (renderPendingRows and
renderCompletedRows)
Smell: Duplicated Code. renderPendingRows and
renderCompletedRows are basically the same loop, just checking
the opposite side of task.completed, and both build rows the
same way.
Cost: If a row needs to look different, I have to remember
to change both methods. Miss one and the two lists quietly stop
matching.
Not yet fixing: noted for Week 3.

## 3. Magic Numbers, src/todo.js
Where: src/todo.js, lines 10, 15, 20, 25, 125
Smell: Magic Numbers. The localStorage key 'todo-tasks' is
typed out twice, and the numbers 3, 20, and 40 show up with no
explanation of what they mean.
Cost: If one of these needs to change, I have to go find
every place it's typed instead of changing it in one spot. A
typo in one copy of the storage key breaks saving or loading
without any error telling me why.
Not yet fixing: noted for Week 3.
