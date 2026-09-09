1. God Object, src/todo.js
Where: src/todo.js, lines 14-96 (class TodoManager)
Smell: God Object. The TodoManager class does everything - it
stores the tasks, checks if the input is valid, saves to
localStorage, and renders the whole list into the DOM.
Cost: There's four different reasons someone would need to
touch this file. If I want to add a second way to save tasks,
I'd have to edit the same class that also handles validation,
so a bug in storage could end up breaking validation too.
Not yet fixing: noted for Week 3.

2. Duplicated Code, src/todo.js
Where: src/todo.js, lines 62-78 (renderPendingRows and
renderCompletedRows)
Smell: Duplicated Code. renderPendingRows and
renderCompletedRows are pretty much the same loop, just
checking the opposite side of task.completed, and they both
build the row the same way.
Cost: If I ever need to change how a row looks, I have to
change it in two places. It would be really easy to update one
and forget the other, and then the two lists stop matching
each other.
Not yet fixing: noted for Week 3.

3. Magic Numbers, src/todo.js
Where: src/todo.js, lines 10, 15, 20, 25, 125
Smell: Magic Numbers. The localStorage key 'todo-tasks' gets
typed out twice, and there's random numbers like 3, 20, and 40
just sitting in the code with no explanation of what they mean.
Cost: If I need to change one of these later, I have to go
hunt through the whole file for it instead of changing it in
one spot. If I typo one copy of the key, saving and loading
stop matching and nothing tells me why.
Not yet fixing: noted for Week 3.
