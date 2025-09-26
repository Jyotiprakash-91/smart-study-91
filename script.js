const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterTasks = document.getElementById('filterTasks');
const sortTasks = document.getElementById('sortTasks');
const searchInput = document.getElementById('searchInput');
const clearAllBtn = document.getElementById('clearAllBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    let filteredTasks = tasks.slice();

    // Filter tasks
    const filterValue = filterTasks.value;
    if(filterValue === 'completed') filteredTasks = filteredTasks.filter(t => t.completed);
    else if(filterValue === 'pending') filteredTasks = filteredTasks.filter(t => !t.completed);

    // Search tasks
    const searchValue = searchInput.value.toLowerCase();
    if(searchValue) filteredTasks = filteredTasks.filter(t => t.text.toLowerCase().includes(searchValue));

    // Sort tasks
    const sortValue = sortTasks.value;
    if(sortValue === 'priority') filteredTasks.sort((a,b) => ['High','Medium','Low'].indexOf(a.priority) - ['High','Medium','Low'].indexOf(b.priority));
    if(sortValue === 'dueDate') filteredTasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));

    taskList.innerHTML = '';
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.innerHTML = `
            <div class="task-details">
                <span class="task-text priority-${task.priority}">${task.text}</span>
                ${task.dueDate ? `<span class="due-date">📅 ${task.dueDate}</span>` : ''}
            </div>
            <div class="task-actions">
                <button onclick="toggleComplete(${index})">✔️</button>
                <button onclick="editTask(${index})">✏️</button>
                <button onclick="deleteTask(${index})">🗑️</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;

    if(!text) return alert('Please enter a task!');
    tasks.push({ text, priority, dueDate, completed:false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    dueDateInput.value = '';
}

function deleteTask(index) {
    tasks.splice(index,1);
    saveTasks();
    renderTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newText = prompt('Edit Task:', tasks[index].text);
    if(newText !== null) tasks[index].text = newText;
    const newPriority = prompt('Edit Priority (Low, Medium, High):', tasks[index].priority);
    if(newPriority) tasks[index].priority = newPriority;
    const newDueDate = prompt('Edit Due Date (YYYY-MM-DD):', tasks[index].dueDate);
    tasks[index].dueDate = newDueDate;
    saveTasks();
    renderTasks();
}

function clearAllTasks() {
    if(confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
window.addEventListener('load', renderTasks);
taskInput.addEventListener('keypress', (e) => { if(e.key==='Enter') addTask(); });
filterTasks.addEventListener('change', renderTasks);
sortTasks.addEventListener('change', renderTasks);
searchInput.addEventListener('input', renderTasks);
clearAllBtn.addEventListener('click', clearAllTasks);
