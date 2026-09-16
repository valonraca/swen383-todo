#Repeated rendering logic:
renderPendingRows() and renderCompletedRows() are almost identical.
They duplicate the same loop pattern and row-generation behavior.
This makes the code harder to maintain and easier to break.

#DOM work mixed with business logic:

The class both manages data and manipulates the DOM.
Rendering is done with string concatenation and innerHTML, then event listeners are attached manually after every render.
This is brittle and can lead to event bugs and performance issues.

#Rebinding listeners on every render:

render() calls querySelectorAll() and adds click handlers each time.
Since the DOM is rebuilt every render, this is a classic smell.
A better approach would be event delegation or rendering only changed elements.

#Magic strings and hard-coded values:

'todo-tasks'
'urgent'
'normal'
'high'
'Done', 'Undo', etc.
These literals are scattered through the code and make the code less flexible.

#Inconsistent data model:

addTask(description, type) accepts description and type, but the task object stores desc, priority, completed, and createdAt.
It also mutates task.desc to include [URGENT] instead of storing a clean task title and a separate priority field.
That mixes presentation and domain data.

#Mutating display text as data:

task.desc = [URGENT] ${trimmed};
This means the actual stored data is being changed to include UI formatting.
That is a smell because the business data and display formatting should stay separate.

#Weak ID generation:

id: Date.now()
This can collide if multiple tasks are added in the same millisecond.
Better to use a more robust ID strategy, such as crypto.randomUUID() or a counter.