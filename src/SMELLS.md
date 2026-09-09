God Object:
TodoManager (lines 2–121) mixes data, localStorage persistence, validation, and DOM rendering/event-binding in one class.

Duplicated Code: 

renderPendingRows and renderCompletedRows (lines 62–78) are the same loop and the same buildTaskRow call, differing only in one if condition.


Feature Envy:

summarizeWorkload(manager) (lines 143–159) is a free function that does nothing but read TodoManager's own tasks data from the outside.