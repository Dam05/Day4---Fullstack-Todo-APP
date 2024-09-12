// Function to get tasks from localStorage
function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Function to save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    const tasks = getTasks();

    tasks.forEach(function(taskText) {
        addTaskToDOM(taskText); // Add each task to the DOM
    });
});

// Function to add a task to the DOM
function addTaskToDOM(taskText) {
    const newTask = document.createElement('li');
    newTask.textContent = taskText;

    // Mark task as completed
    newTask.addEventListener('click', function() {
        newTask.classList.toggle('completed');
    });

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    // Add fade-out effect before deleting
    deleteBtn.addEventListener('click', function() {
        newTask.classList.add('fade-out');
        setTimeout(function() {
            const tasks = getTasks();
            const filteredTasks = tasks.filter(task => task !== taskText); // Remove task from localStorage
            saveTasks(filteredTasks);
            document.getElementById('task-list').removeChild(newTask);
        }, 500);
    });

    // Append the delete button to the task
    newTask.appendChild(deleteBtn);

    // Append the task to the task list
    document.getElementById('task-list').appendChild(newTask);
}

// Event listener for adding a task
document.getElementById('add-task-btn').addEventListener('click', function() {
    const taskInput = document.getElementById('task-input').value;

    if (taskInput.trim() !== '') {
        const tasks = getTasks();
        tasks.push(taskInput); // Add new task to localStorage
        saveTasks(tasks);      // Save updated tasks

        addTaskToDOM(taskInput); // Add task to the DOM

        // Clear the input field
        document.getElementById('task-input').value = '';
    } else {
        alert('Please enter a task.');
    }
});