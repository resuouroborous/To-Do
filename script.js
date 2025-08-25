        document.addEventListener('DOMContentLoaded', () => {
            const taskForm = document.getElementById('task-form');
            const taskInput = document.getElementById('task-input');
            const taskList = document.getElementById('task-list');
            const noTasksMessage = document.getElementById('no-tasks-message');

            // --- State Management ---
            let tasks = [];

            // --- Local Storage ---
            const loadTasks = () => {
                const storedTasks = localStorage.getItem('tasks');
                if (storedTasks) {
                    tasks = JSON.parse(storedTasks);
                }
                renderTasks();
            };

            const saveTasks = () => {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            };

            // --- Core Functions ---
            const renderTasks = () => {
                taskList.innerHTML = '';

                if (tasks.length === 0) {
                    noTasksMessage.classList.remove('hidden');
                } else {
                    noTasksMessage.classList.add('hidden');
                }

                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = 'task-item';
                    li.dataset.id = task.id;

                    if (task.completed) {
                        li.classList.add('completed');
                    }

                    // Task text span
                    const taskText = document.createElement('span');
                    taskText.className = 'task-text';
                    taskText.textContent = task.text;

                    // Buttons container
                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.className = 'task-buttons';

                    // Complete/Undo Button
                    const completeButton = document.createElement('button');
                    if (task.completed) {
                        completeButton.textContent = 'Undo';
                        completeButton.className = 'undo-btn';
                    } else {
                        completeButton.textContent = 'Done';
                        completeButton.className = 'complete-btn';
                    }
                    
                    // Delete Button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-btn';

                    // Append elements
                    buttonsDiv.appendChild(completeButton);
                    buttonsDiv.appendChild(deleteButton);
                    li.appendChild(taskText);
                    li.appendChild(buttonsDiv);
                    taskList.appendChild(li);
                });
            };

            const addTask = (text) => {
                if (text.trim() === '') {
                    // A simple, non-blocking way to show an error
                    taskInput.style.borderColor = 'var(--danger-color)';
                    setTimeout(() => { taskInput.style.borderColor = '' }, 1500);
                    return;
                }
                const newTask = {
                    id: Date.now(),
                    text: text,
                    completed: false
                };
                tasks.unshift(newTask); // Use unshift to add to the top
                saveTasks();
                renderTasks();
            };


            const toggleComplete = (id) => {
                const task = tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks();
                }
            };

            const deleteTask = (id) => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
            };

            // --- Event Listeners ---
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addTask(taskInput.value);
                taskInput.value = '';
            });

            taskList.addEventListener('click', (e) => {
                const target = e.target;
                const li = target.closest('li.task-item');
                if (!li) return;

                const taskId = Number(li.dataset.id);

                if (target.classList.contains('delete-btn')) {
                    deleteTask(taskId);
                } else if (target.classList.contains('complete-btn') || target.classList.contains('undo-btn')) {
                    toggleComplete(taskId);
                }
            });

            // --- Initial Load ---
            loadTasks();
        });