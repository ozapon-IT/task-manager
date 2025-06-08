<template>
    <div>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold dark:text-gray-400">Projects</h1>
                <p class="text-sm opacity-70 mt-1">Manage and organize your projects</p>
            </div>
            <BaseButton @click="openProjectModal" class="mt-3 md:mt-0" class-name="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-gray-100 dark:text-gray-800 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                New Project
            </BaseButton>
        </div>

        <div class="mb-6 flex flex-col sm:flex-row gap-4">
            <BaseInput v-model="searchQuery" placeholder="Search projects..." class="flex-1">
                <template #icon-left>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </template>
            </BaseInput>

            <select v-model="statusFilter" class="select select-bordered dark:text-gray-400">
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
            </select>
        </div>

        <div v-if="filteredProjects.length === 0" class="mt-8">
            <EmptyState :title="searchQuery || statusFilter !== 'all' ? 'No matching projects' : 'No projects yet'"
                :description="searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first project to get started'">
                <template #action>
                    <BaseButton @click="openProjectModal" v-if="!searchQuery && statusFilter === 'all'" class-name="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-gray-100 dark:text-gray-800 font-bold">
                        Create Project
                    </BaseButton>
                    <BaseButton @click="resetFilters" variant="secondary" v-else>
                        Reset Filters
                    </BaseButton>
                </template>
            </EmptyState>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard v-for="project in filteredProjects" :key="project.id" :project="project"
                :tasks-count="getTasksCountForProject(project.id)" @view="navigateToProject"
                @edit="openEditProjectModal" @delete="confirmDeleteProject" />
        </div>

        <ProjectFormModal :is-open="isProjectModalOpen" :project="selectedProject" @close="closeProjectModal"
            @save="saveProject" />

        <dialog :open="isDeleteConfirmOpen" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Confirm Delete</h3>
                <p class="py-4">Are you sure you want to delete this project? This action cannot be undone and will also
                    delete
                    all tasks associated with this project.</p>
                <div class="modal-action">
                    <button class="btn" @click="isDeleteConfirmOpen = false">Cancel</button>
                    <button class="btn btn-error" @click="deleteProject">Delete</button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="isDeleteConfirmOpen = false">close</button>
            </form>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProjectStore } from '~/stores/project';
import { useTaskStore } from '~/stores/task';
import BaseInput from '~/components/base/BaseInput.vue';
import BaseButton from '~/components/base/BaseButton.vue';
import EmptyState from '~/components/EmptyState.vue';

const projectStore = useProjectStore();
const taskStore = useTaskStore();

// Filters
const searchQuery = ref('');
const statusFilter = ref('all');

// Reset filters
function resetFilters() {
    searchQuery.value = '';
    statusFilter.value = 'all';
}

// Filtered projects
const filteredProjects = computed(() => {
    return projectStore.projects
        .filter(project => {
            const matchesSearch = searchQuery.value === '' ||
                project.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                (project.description && project.description.toLowerCase().includes(searchQuery.value.toLowerCase()));

            const matchesStatus = statusFilter.value === 'all' || project.status === statusFilter.value;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

// Helper to get task count for a project
function getTasksCountForProject(projectId: string) {
    return taskStore.tasks.filter(task => task.projectId === projectId).length;
}

// Project modal state
const isProjectModalOpen = ref(false);
const selectedProject = ref(null);

function openProjectModal() {
    selectedProject.value = null;
    isProjectModalOpen.value = true;
}

function openEditProjectModal(project: any) {
    selectedProject.value = project;
    isProjectModalOpen.value = true;
}

function closeProjectModal() {
    isProjectModalOpen.value = false;
    selectedProject.value = null;
}

// Project operations
function saveProject(projectData: any) {
    if (selectedProject.value) {
        projectStore.updateProject(projectData);
    } else {
        const newProject = {
            ...projectData,
            id: projectStore.generateId(),
        };
        projectStore.addProject(newProject);
    }
    closeProjectModal();
}

// Delete project confirmation
const isDeleteConfirmOpen = ref(false);
const projectToDelete = ref('');

function confirmDeleteProject(projectId: string) {
    projectToDelete.value = projectId;
    isDeleteConfirmOpen.value = true;
}

function deleteProject() {
    // Delete all associated tasks
    const tasksToDelete = taskStore.tasks.filter(task => task.projectId === projectToDelete.value);
    tasksToDelete.forEach(task => taskStore.deleteTask(task.id));

    // Delete the project
    projectStore.deleteProject(projectToDelete.value);

    isDeleteConfirmOpen.value = false;
    projectToDelete.value = '';
}

// Navigation
function navigateToProject(projectId: string) {
    navigateTo(`/projects/${projectId}`);
}
</script>