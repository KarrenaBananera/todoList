class Task {
    constructor(id, title, description, status, dueDate, createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status; // 'ToDo', 'InProgress', 'Done'
        this.dueDate = dueDate;
        this.createdAt = createdAt || new Date().toISOString();
    }
}

// Attach to window object for access across scripts
window.Task = Task;
