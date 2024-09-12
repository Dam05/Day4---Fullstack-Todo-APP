// Function to fetch tasks from the server
async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    return tasks;
}

// Function to add a new task to the server
async function addTaskToServer(taskText) {
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskText }),
    });
    return response.ok;
}

// Function to delete a task from the server by ID
async function deleteTaskFromServer(taskId) {
    const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
    });
    return response.ok;
}

// Load tasks from the server when the page is loaded
document.addEventListener('DOMContentLoaded', async function() {
    const tasks = await fetchTasks();
    tasks.forEach(function(task) {
        addTaskToDOM(task.id, task.task);
    });
});

// Function to add a task to the DOM
function addTaskToDOM(taskId, taskText) {
    const newTask = document.createElement('li');
    newTask.textContent = taskText;

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', async function() {
        const deleted = await deleteTaskFromServer(taskId);
        if (deleted) {
            document.getElementById('task-list').removeChild(newTask);
        } else {
            alert('Failed to delete task.');
        }
    });

    newTask.appendChild(deleteBtn);
    document.getElementById('task-list').appendChild(newTask);
}

// Event listener for adding a task
document.getElementById('add-task-btn').addEventListener('click', async function() {
    const taskInput = document.getElementById('task-input').value;
    if (taskInput.trim() !== '') {
        const added = await addTaskToServer(taskInput);
        if (added) {
            const tasks = await fetchTasks();
            const latestTask = tasks[tasks.length - 1];
            addTaskToDOM(latestTask.id, latestTask.task);
            document.getElementById('task-input').value = '';
        } else {
            alert('Failed to add task.');
        }
    } else {
        alert('Please enter a task.');
    }
});
