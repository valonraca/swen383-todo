## 1. God Object, src/todo.js
Where: src/todo.js, lines 2-96 (class TodoManager)
Smell: God Object. TodoManager is responsible for task data, validation, persistence through localStorage, rendering the task lists, DOM event handling, and updating the document title.
Cost: There are several unrelated reasons to change this class. For example, changing the storage system, modifying the UI, or changing task validation all requires editing TodoManager. As the application grows, adding another storage option or changing the rendering could make this class harder to test and increase the risk that a change in one responsibility breaks another.
