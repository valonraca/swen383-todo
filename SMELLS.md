
#1 Long Method

Where: src/todo.js, lines 78-119 (render)
Smell: render builds two HTML blocks, computes the oldest-pending label, sets innerHTML, queries and reattaches toggle listeners, reattaches delete listeners, runs the flash animation, and updates document.title — seven distinct jobs in one scroll.


#2 Long Parameter List

Where: src/todo.js, lines 100-119 (buildTaskRow)
Smell: Six positional parameters (id, desc, completed, priority, createdAt, showActions), several derived from a single task object that the callers already hold.

#3 Duplicated Code

 (renderPendingRows / renderCompletedRows).

#4 Feature Envy

Where: src/todo.js, lines 122-138 (summarizeWorkload)
Smell: A free function whose every line reaches into manager.tasks — it loops the tasks, counts done/urgent/normal, reads .length. It envies TodoManager's data and belongs on it as a method.
