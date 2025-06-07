import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Project } from '~/types/index.ts';

export const useProjectStore = defineStore('project', () => {
    // State
    const projects = ref<Project[]>([]);

    // Getters
    function getProjectById(id: string): Project | undefined {
        return projects.value.find(project => project.id === id);
    }

    // Actions
    function addProject(projectData: Omit<Project, 'id' | 'createdAt'>) {
        const newProject: Project = {
            id: generateId(),
            title: projectData.title,
            description: projectData.description || '',
            status: projectData.status || 'Active',
            createdAt: new Date().toISOString(),
            completed: projectData.status === 'Completed'
        };

        projects.value.push(newProject);

        // Save to localStorage
        saveToLocalStorage();

        return newProject;
    }

    function updateProject(projectData: Partial<Project> & { id: string }) {
        const index = projects.value.findIndex(p => p.id === projectData.id);
        if (index !== -1) {
            const updatedProject = {
                ...projects.value[index],
                ...projectData,
                completed: projectData.status === 'Completed'
            };
            projects.value[index] = updatedProject;

            // Save to localStorage
            saveToLocalStorage();

            return updatedProject;
        }
        return null;
    }

    function deleteProject(id: string) {
        projects.value = projects.value.filter(project => project.id !== id);

        // Save to localStorage
        saveToLocalStorage();
    }

    // Initialize with examples
    function initializeWithExamples() {
        if (projects.value.length === 0) {
            const exampleProjects = [
                {
                    id: 'p1',
                    title: 'Website Redesign',
                    description: 'Redesigning the company website with modern UI/UX principles',
                    status: 'Active',
                    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
                    completed: false
                },
                {
                    id: 'p2',
                    title: 'Mobile App Development',
                    description: 'Creating a cross-platform mobile application for our product',
                    status: 'Active',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
                    completed: false
                },
                {
                    id: 'p3',
                    title: 'Q1 Marketing Campaign',
                    description: 'Planning and executing the Q1 marketing strategy',
                    status: 'Completed',
                    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
                    completed: true
                }
            ];

            projects.value = exampleProjects;
            saveToLocalStorage();
        }
    }

    // Helper functions
    function generateId(): string {
        return 'p' + Math.random().toString(36).substring(2, 9);
    }

    function saveToLocalStorage() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('taskManager_projects', JSON.stringify(projects.value));
        }
    }

    function loadFromLocalStorage() {
        if (typeof window !== 'undefined') {
            const savedProjects = localStorage.getItem('taskManager_projects');
            if (savedProjects) {
                projects.value = JSON.parse(savedProjects);
            }
        }
    }

    // Load data on store initialization
    if (typeof window !== 'undefined') {
        loadFromLocalStorage();
    }

    return {
        projects,
        getProjectById,
        addProject,
        updateProject,
        deleteProject,
        initializeWithExamples
    };
});