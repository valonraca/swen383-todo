## 1. God Object, src/todo.js
**Where:** src/todo.js, lines 2-121 (class TodoManager)
**Smell:** This one class stores the tasks, saves them to localStorage,
decides if a task is valid, and builds/renders all the HTML. It's doing
four unrelated jobs at once.
**Cost:** If I ever swap out localStorage for something else, I have to
dig through the same file that also handles validation and rendering.
A small storage change could easily break something unrelated by accident.
**Not yet fixing:** noted for Week 3.

## 2. Feature Envy, src/todo.js
**Where:** src/todo.js, lines 143-160 (function summarizeWorkload)
**Smell:** This function has no data of its own — it just loops over
manager.tasks and counts things. It's basically living inside
TodoManager's business without being part of the class.
**Cost:** If the task shape ever changes (like a new priority level), I'd
have to remember this function exists off on its own and update it too,
even though nothing about its location makes that obvious.
**Not yet fixing:** noted for Week 3.

## 3. Magic Numbers, src/todo.js
**Where:** src/todo.js, line 20 (`< 3`), line 25 (`>= 20`), line 125 (`> 40`)
**Smell:** Three unexplained numbers — minimum task length, a warning
threshold, and a truncation limit — with no comment saying why those
specific values were chosen.
**Cost:** If any of these ever need to change, I have to hunt through
the file for bare numbers and hope I find the right one, since nothing
labels what each number actually means.
**Not yet fixing:** noted for Week 3.