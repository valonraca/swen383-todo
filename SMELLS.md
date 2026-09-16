## 1. Duplicated Code
**Where:** src/todo.js, lines 62-78 
**Smell:** renderPendingRows and renderCompletedRows are basically the same loop. The only difference is that one grabs completed tasks, while the other grabs pending ones. 
**Cost:** If you need to change how a row looks, you have to remember to update it in both places.


## 2. Magic Numbers
**Where:** src/todo.js, lines 25, 115, 125
**Smell:** Random unexplained numbers in the code: 20 (task list limit, line 25), 1500 (how long the flash animation lasts in ms, line 115) and 40 (how long a task title can be before it gets cut off, line 125).
**Cost:** If you're reading the code and see "40", you have no idea why it's 40 and not 50, or where else that number might matter.


## 3. Long Parameter List
**Where:** src/todo.js, line 124
**Smell:** buildTaskRow takes 6 separate values (id, desc, completed, priority, createdAt, showActions) instead of just one task object
**Cost:** Easy to accidentally mix up the order and get unwanted bugs.


## 4. Long Method
**Where:** lines 80-120 (render)
**Smell:** render() is doing too much at the same time. Several jobs stacked into one function.
**Cost:** Hard to read, hard to test one part without dragging the whole thing with it. You can't just check "does the oldest task work" without running the entire function.