document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentFilter = 'All';
    let currentSort = 'CreatedDesc';
    let currentPage = 1;
    let pageSize = 6;
    let taskModalInstance = null;
    let deleteModalInstance = null;

    // Elements
    const statusFilter = document.getElementById('statusFilter');
    const sortTasks = document.getElementById('sortTasks');
    const btnCreateTask = document.getElementById('btnCreateTask');
    const btnSaveTask = document.getElementById('btnSaveTask');
    const taskForm = document.getElementById('taskForm');
    const taskModalEl = document.getElementById('taskFormModal');
    const deleteModalEl = document.getElementById('deleteConfirmModal');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');

    // Init modules
    AuthUI.init();
    
    if (taskModalEl) {
        taskModalInstance = new bootstrap.Modal(taskModalEl);
    }
    
    if (deleteModalEl) {
        deleteModalInstance = new bootstrap.Modal(deleteModalEl);
    }

    // Init UI Bindings
    TaskUI.bindEvents({
        onEdit: handleEdit,
        onDelete: handleDeletePrompt,
        onChangeStatus: handleChangeStatus,
        onPageChange: handlePageChange
    });

    // Event Listeners for Filters & Sort
    if(statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilter = e.target.value;
            currentPage = 1; // Reset to page 1 on filter
            loadTasks();
        });
    }

    if(sortTasks) {
        sortTasks.addEventListener('change', (e) => {
            currentSort = e.target.value;
            loadTasks();
        });
    }

    if(btnCreateTask) {
        btnCreateTask.addEventListener('click', () => {
            document.getElementById('taskId').value = '';
            taskForm.reset();
            document.getElementById('taskFormModalLabel').textContent = 'Create Task';
            taskModalInstance.show();
        });
    }

    if(btnSaveTask) {
        btnSaveTask.addEventListener('click', async () => {
            if(!taskForm.checkValidity()) {
                taskForm.reportValidity();
                return;
            }

            const id = document.getElementById('taskId').value;
            let finishValue = document.getElementById('taskDueDate').value;
            if (!finishValue) {
                finishValue = new Date().toISOString().split('T')[0];
            }

            const taskData = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                status: document.getElementById('taskStatus').value,
                finish: finishValue
            };

            if(id) {
                const success = await TaskService.updateTask(id, taskData);
                if (success) TaskUI.showToast('Task updated successfully.');
            } else {
                const success = await TaskService.createTask(taskData);
                if (success) TaskUI.showToast('Task created successfully.');
            }

            taskModalInstance.hide();
            await loadTasks();
        });
    }

    if(btnConfirmDelete) {
        btnConfirmDelete.addEventListener('click', async () => {
            const id = document.getElementById('deleteTaskId').value;
            const success = await TaskService.deleteTask(id);
            if(success) {
                TaskUI.showToast('Task deleted successfully.');
                await loadTasks();
            }
            deleteModalInstance.hide();
        });
    }

    // Handlers
    function handleEdit(id) {
        const task = TaskService.getTaskById(id);
        if(task) {
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskStatus').value = task.status;
            
            if (task.dueDate) {
                // dueDate from API is typically ISO string "2026-06-30T00:00:00", we just need the date part for <input type="date">
                document.getElementById('taskDueDate').value = task.dueDate.split('T')[0];
            } else {
                document.getElementById('taskDueDate').value = '';
            }
            
            document.getElementById('taskFormModalLabel').textContent = 'Edit Task';
            taskModalInstance.show();
        }
    }

    function handleDeletePrompt(id) {
        document.getElementById('deleteTaskId').value = id;
        deleteModalInstance.show();
    }

    async function handleChangeStatus(id, newStatus) {
        const success = await TaskService.updateTaskStatus(id, newStatus);
        if(success) {
            TaskUI.showToast('Task status updated.');
            await loadTasks();
        }
    }

    function handlePageChange(page) {
        currentPage = page;
        loadTasks();
    }

    async function loadTasks() {
        const result = await TaskService.getTasks(currentFilter, currentSort, currentPage, pageSize);
        TaskUI.renderTasks(result);
    }

    // Initial load
    loadTasks();
});
