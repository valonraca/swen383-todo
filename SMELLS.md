1. God Object, src/todo.js
Where: src/todo.js, lines 14-96 (class TodoManager)
Smell: God Object. It stores tasks, validates input,
writes to localStorage and renders the list into the DOM.
Cost: Four unrelated reasons to change this file. Adding a
second storage option means editing the same class that owns
validation, so a storage bug can break validation.
Not yet fixing: noted for Week 3.

2. Duplicated Code, src/todo.js
Where: src/todo.js, lines 62-78 (renderPendingRows and
renderCompletedRows)
Smell: Duplicated Code. Two loops that do the same thing,
just checking opposite sides of task.completed.
Cost: One change means editing two places. Miss one and the
lists stop matching.
Not yet fixing: noted for Week 3.

3. Magic Numbers, src/todo.js
Where: src/todo.js, lines 10, 15, 20, 25, 125
Smell: Magic Numbers. The storage key 'todo-tasks' is typed
twice, and 3, 20, and 40 show up with no explanation.
Cost: Changing one means hunting through the file. A typo in
one copy of the key breaks saving with no warning.
Not yet fixing: noted for Week 3.
