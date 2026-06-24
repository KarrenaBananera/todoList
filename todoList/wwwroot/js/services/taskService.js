const TaskService = (function() {
    let _cachedTasks = [];

    function getAntiForgeryToken() {
        return document.querySelector('input[name="__RequestVerificationToken"]')?.value || '';
    }

    async function getTasks(filter = 'All', sort = 'CreatedDesc', page = 1, pageSize = 6) {
        let filterParam = filter === 'All' ? '' : `&filter=${filter}`;
        
        const countResponse = await fetch(`/Api/ToDo?handler=Count${filterParam}`);
        if (!countResponse.ok) return { items: [], totalItems: 0, totalPages: 1, currentPage: page };
        const countData = await countResponse.json();
        const totalTasks = countData.count;

        const listResponse = await fetch(`/Api/ToDo?handler=List&page=${page}&pageSize=${pageSize}&sort=${sort}${filterParam}`);
        if (!listResponse.ok) return { items: [], totalItems: 0, totalPages: 1, currentPage: page };
        const listData = await listResponse.json();
        
        _cachedTasks = listData.items;

        const totalPages = Math.ceil(totalTasks / pageSize);

        return {
            items: _cachedTasks,
            totalItems: totalTasks,
            totalPages: totalPages === 0 ? 1 : totalPages,
            currentPage: page
        };
    }

    function getTaskById(id) {
        return _cachedTasks.find(t => t.id === parseInt(id));
    }

    async function createTask(taskData) {
        const response = await fetch('/Api/ToDo?handler=Create', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'RequestVerificationToken': getAntiForgeryToken()
            },
            body: JSON.stringify(taskData)
        });
        return response.ok;
    }

    async function updateTask(id, taskData) {
        taskData.id = parseInt(id);
        const response = await fetch('/Api/ToDo?handler=Update', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'RequestVerificationToken': getAntiForgeryToken()
            },
            body: JSON.stringify(taskData)
        });
        return response.ok;
    }

    async function deleteTask(id) {
        const task = getTaskById(id);
        if (!task) return false;

        const response = await fetch('/Api/ToDo?handler=Delete', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'RequestVerificationToken': getAntiForgeryToken()
            },
            body: JSON.stringify(task)
        });
        return response.ok;
    }

    async function updateTaskStatus(id, newStatus) {
        const task = getTaskById(id);
        if (task) {
            task.status = newStatus;
            return await updateTask(id, task);
        }
        return false;
    }

    return {
        getTasks,
        getTaskById,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus
    };
})();

window.TaskService = TaskService;
