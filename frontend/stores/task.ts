import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Task } from '~/types/index.ts';

export const useTaskStore = defineStore('task', () => {
    // State
    const tasks = ref<Task[]>([]);

    // Getters
    function getTasksByProjectId(projectId: string): Task[] {
        return tasks.value.filter(task => task.projectId === projectId);
    }

    function getTaskById(id: string): Task | undefined {
        return tasks.value.find(task => task.id === id);
    }

    // Actions
    function addTask(taskData: Omit<Task, 'id' | 'createdAt'>) {
        const newTask: Task = {
            id: generateId(),
            title: taskData.title,
            description: taskData.description || '',
            priority: taskData.priority || 'Medium',
            dueDate: taskData.dueDate || '',
            completed: taskData.completed || false,
            projectId: taskData.projectId,
            createdAt: new Date().toISOString()
        };

        tasks.value.push(newTask);

        // Save to localStorage
        saveToLocalStorage();

        return newTask;
    }

    function updateTask(taskData: Partial<Task> & { id: string }) {
        const index = tasks.value.findIndex(t => t.id === taskData.id);
        if (index !== -1) {
            const updatedTask = {
                ...tasks.value[index],
                ...taskData
            };
            tasks.value[index] = updatedTask;

            // Save to localStorage
            saveToLocalStorage();

            return updatedTask;
        }
        return null;
    }

    function deleteTask(id: string) {
        tasks.value = tasks.value.filter(task => task.id !== id);

        // Save to localStorage
        saveToLocalStorage();
    }

    function toggleTaskComplete(id: string) {
        const task = tasks.value.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;

            // Save to localStorage
            saveToLocalStorage();
        }
    }

    // Initialize with examples
    function initializeWithExamples() {
        if (tasks.value.length === 0) {
            const exampleTasks = [
                {
                    id: 't1',
                    title: 'Create wireframes',
                    description: 'Design initial wireframes for the homepage and product pages',
                    priority: 'High',
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
                    completed: false,
                    projectId: 'p1',
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 't2',
                    title: 'Content audit',
                    description: 'Review and organize current website content',
                    priority: 'Medium',
                    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
                    completed: true,
                    projectId: 'p1',
                    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 't3',
                    title: 'Create design system',
                    description: 'Establish color palette, typography, and component library',
                    priority: 'High',
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
                    completed: false,
                    projectId: 'p1',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 't4',
                    title: 'Set up project structure',
                    description: 'Initialize the app and configure development environment',
                    priority: 'High',
                    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
                    completed: false,
                    projectId: 'p2',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 't5',
                    title: 'Design user authentication flow',
                    description: 'Create screens for login, registration, and password recovery',
                    priority: 'Medium',
                    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
                    completed: false,
                    projectId: 'p2',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 't6',
                    title: 'Finalize campaign budget',
                    description: 'Complete the budget allocation for different marketing channels',
                    priority: 'High',
                    dueDate: '',
                    completed: true,
                    projectId: 'p3',
                    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];

            tasks.value = exampleTasks;
            saveToLocalStorage();
        }
    }

    // Helper functions
    function generateId(): string {
        return 't' + Math.random().toString(36).substring(2, 9);
    }

    function saveToLocalStorage() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('taskManager_tasks', JSON.stringify(tasks.value));
        }
    }

    function loadFromLocalStorage() {
        if (typeof window !== 'undefined') {
            const savedTasks = localStorage.getItem('taskManager_tasks');
            if (savedTasks) {
                tasks.value = JSON.parse(savedTasks);
            }
        }
    }

    // Load data on store initialization
    if (typeof window !== 'undefined') {
        loadFromLocalStorage();
    }

    return {
        tasks,
        getTasksByProjectId,
        getTaskById,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        initializeWithExamples
    };
});