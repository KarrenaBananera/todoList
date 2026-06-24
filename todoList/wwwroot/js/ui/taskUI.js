const TaskUI = (function() {
    let _onEditTask = null;
    let _onDeleteTask = null;
    let _onChangeStatus = null;
    let _onPageChange = null;

    const statusColors = {
        'ToDo': 'bg-secondary',
        'InProgress': 'bg-primary',
        'Done': 'bg-success'
    };

    const statusLabels = {
        'ToDo': 'To Do',
        'InProgress': 'In Progress',
        'Done': 'Done'
    };

    function bindEvents(callbacks) {
        _onEditTask = callbacks.onEdit;
        _onDeleteTask = callbacks.onDelete;
        _onChangeStatus = callbacks.onChangeStatus;
        _onPageChange = callbacks.onPageChange;
    }

    function renderTasks(pagedResult) {
        const container = document.getElementById('taskListContent');
        const emptyState = document.getElementById('emptyState');
        
        container.innerHTML = '';
        
        if (pagedResult.items.length === 0) {
            container.classList.add('d-none');
            emptyState.classList.remove('d-none');
        } else {
            container.classList.remove('d-none');
            emptyState.classList.add('d-none');
            
            pagedResult.items.forEach(task => {
                const card = document.createElement('div');
                card.className = 'col';
                
                let formattedDueDate = '';
                if (task.finish) {
                    formattedDueDate = new Date(task.finish).toLocaleDateString();
                }
                const dueDateHtml = formattedDueDate ? `<small class="text-muted d-block"><i class="bi bi-calendar-event"></i> Due: ${formattedDueDate}</small>` : '';
                
                let formattedCreatedAt = '';
                if (task.created) {
                    formattedCreatedAt = new Date(task.created).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                }
                const createdAtHtml = formattedCreatedAt ? `<small class="text-muted d-block"><i class="bi bi-clock"></i> Created: ${formattedCreatedAt}</small>` : '';
                
                card.innerHTML = `
                    <div class="card h-100 shadow-sm border-${task.status === 'Done' ? 'success' : 'light'}">
                        <div class="card-body position-relative">
                            <span class="badge ${statusColors[task.status]} position-absolute top-0 end-0 mt-2 me-2">${statusLabels[task.status]}</span>
                            <h5 class="card-title fw-semibold mt-2 pe-5">${task.title}</h5>
                            <p class="card-text">${task.description || '<em class="text-muted">No description</em>'}</p>
                            ${createdAtHtml}
                            ${dueDateHtml}
                        </div>
                        <div class="card-footer bg-transparent d-flex justify-content-between align-items-center">
                            <select class="form-select form-select-sm w-auto status-select" data-id="${task.id}">
                                <option value="ToDo" ${task.status === 'ToDo' ? 'selected' : ''}>To Do</option>
                                <option value="InProgress" ${task.status === 'InProgress' ? 'selected' : ''}>In Progress</option>
                                <option value="Done" ${task.status === 'Done' ? 'selected' : ''}>Done</option>
                            </select>
                            <div>
                                <button class="btn btn-sm btn-outline-primary btn-edit" data-id="${task.id}"><i class="bi bi-pencil"></i></button>
                                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${task.id}"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            // Bind inline events
            container.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    if(_onEditTask) _onEditTask(id);
                });
            });

            container.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    if(_onDeleteTask) _onDeleteTask(id);
                });
            });

            container.querySelectorAll('.status-select').forEach(select => {
                select.addEventListener('change', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const newStatus = e.currentTarget.value;
                    if(_onChangeStatus) _onChangeStatus(id, newStatus);
                });
            });
        }

        renderPagination(pagedResult);
    }

    function renderPagination(pagedResult) {
        const pagination = document.getElementById('paginationControls');
        pagination.innerHTML = '';

        if (pagedResult.totalPages <= 1) return;

        // Prev
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${pagedResult.currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" data-page="${pagedResult.currentPage - 1}">Previous</a>`;
        pagination.appendChild(prevLi);

        // Pages
        for(let i = 1; i <= pagedResult.totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${pagedResult.currentPage === i ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            pagination.appendChild(li);
        }

        // Next
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${pagedResult.currentPage === pagedResult.totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" data-page="${pagedResult.currentPage + 1}">Next</a>`;
        pagination.appendChild(nextLi);

        // Bind clicks
        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.currentTarget.getAttribute('data-page'));
                if(page && page !== pagedResult.currentPage && _onPageChange) {
                    _onPageChange(page);
                }
            });
        });
    }

    function showToast(message, type = 'success') {
        const toastEl = document.getElementById('appToast');
        const toastMsg = document.getElementById('appToastMessage');
        toastMsg.textContent = message;
        
        toastEl.classList.remove('text-bg-success', 'text-bg-danger');
        toastEl.classList.add(type === 'success' ? 'text-bg-success' : 'text-bg-danger');

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    return {
        bindEvents,
        renderTasks,
        showToast
    };
})();

window.TaskUI = TaskUI;
