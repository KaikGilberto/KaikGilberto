// Personal Routine Management App - Terminal Style
class RoutineManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.contentDiv = document.getElementById('content');
        this.idCounter = Date.now(); // Initialize counter for unique IDs
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    loadTasks() {
        const saved = localStorage.getItem('routineTasks');
        return saved ? JSON.parse(saved) : [];
    }

    saveTasks() {
        localStorage.setItem('routineTasks', JSON.stringify(this.tasks));
    }

    addTask(description) {
        if (!description.trim()) return;
        
        const task = {
            id: ++this.idCounter, // Increment counter to ensure unique IDs
            description: description.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.render();
    }

    render() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        const totalCount = this.tasks.length;
        
        let html = `
<span style="color: #0ff; text-shadow: 0 0 10px #0ff;">╔════════════════════════════════════════════════════════════════╗</span>
<span style="color: #0ff; text-shadow: 0 0 10px #0ff;">║</span>  <span style="color: #0f0; font-weight: bold; text-shadow: 0 0 10px #0f0;">PERSONAL ROUTINE MANAGER v2.0</span>                             <span style="color: #0ff; text-shadow: 0 0 10px #0ff;">║</span>
<span style="color: #0ff; text-shadow: 0 0 10px #0ff;">╚════════════════════════════════════════════════════════════════╝</span>

<span style="color: #f0f;">STATUS:</span> <span style="color: #0f0;">${completedCount}/${totalCount} tasks completed</span>

<span style="color: #ff0;">┌─ ADD NEW TASK</span>
<input type="text" id="taskInput" class="task-input" placeholder="Enter your task...">
<button id="addTaskBtn" class="add-task-btn">
    [+] ADD TASK
</button>

<span style="color: #ff0;">└─ CURRENT TASKS</span>
`;

        if (this.tasks.length === 0) {
            html += `
<div style="color: #888; margin: 20px 0; font-style: italic;">
    > No tasks yet. Add your first routine task above!
</div>`;
        } else {
            html += '<div style="margin: 20px 0;">';
            this.tasks.forEach((task, index) => {
                const status = task.completed ? 
                    '<span style="color: #0f0; text-shadow: 0 0 5px #0f0;">[✓]</span>' : 
                    '<span style="color: #ff0; text-shadow: 0 0 5px #ff0;">[○]</span>';
                
                const textStyle = task.completed ? 
                    'color: #0f0; text-decoration: line-through; opacity: 0.6;' : 
                    'color: #0ff;';
                
                const deleteBtn = `<span class="delete-btn" data-id="${task.id}" title="Delete task">[X]</span>`;
                
                html += `
<div style="margin: 10px 0; padding: 10px; background: rgba(0, 255, 255, 0.05); border-left: 3px solid ${task.completed ? '#0f0' : '#ff0'}; border-radius: 3px;">
    <span class="task-toggle" data-id="${task.id}">
        ${status} <span style="${textStyle}">${this.escapeHtml(task.description)}</span>
    </span>
    ${deleteBtn}
</div>`;
            });
            html += '</div>';
        }

        html += `
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #0ff;">
    <span style="color: #888; font-size: 12px;">
        [TAB] to navigate • [ENTER] to add task • Click [○] to toggle • Click [X] to delete
    </span>
</div>`;

        this.contentDiv.innerHTML = html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupEventListeners() {
        // Use event delegation for all dynamic elements - single click handler
        this.contentDiv.addEventListener('click', (e) => {
            // Handle task toggle
            if (e.target.classList.contains('task-toggle') || e.target.closest('.task-toggle')) {
                const toggleElement = e.target.classList.contains('task-toggle') ? 
                    e.target : e.target.closest('.task-toggle');
                const id = parseInt(toggleElement.dataset.id);
                this.toggleTask(id);
            }
            
            // Handle task deletion
            if (e.target.classList.contains('delete-btn')) {
                const id = parseInt(e.target.dataset.id);
                if (confirm('Delete this task?')) {
                    this.deleteTask(id);
                }
            }
            
            // Handle add task button
            if (e.target.id === 'addTaskBtn') {
                const input = document.getElementById('taskInput');
                if (input) {
                    this.addTask(input.value);
                    input.value = '';
                    input.focus();
                }
            }
        });

        // Handle Enter key in input
        this.contentDiv.addEventListener('keypress', (e) => {
            if (e.target.id === 'taskInput' && e.key === 'Enter') {
                e.preventDefault();
                const input = e.target;
                this.addTask(input.value);
                input.value = '';
            }
        });
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RoutineManager();
});
