<template>
    <div>
        <ClientOnly>
            <div v-if="!project" class="flex flex-col items-center justify-center py-12">
                <div class="flex justify-center alert alert-error shadow-lg max-w-md">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Project not found</span>
                    </div>
                </div>
                <BaseButton @click="navigateTo('/projects')"
                    class-name="mt-6 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-400">
                    Back to Projects</BaseButton>
            </div>

            <div v-else>
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <div class="flex items-center gap-2">
                            <NuxtLink to="/projects"
                                class="btn btn-ghost btn-sm light:hover:bg-gray-100/10 dark:hover:bg-gray-100/10 border-0 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </NuxtLink>
                            <h1 class="m-0 text-2xl font-bold"
                                :class="{ 'line-through opacity-50': project.status === 'Completed' }">
                                {{ project.title }}
                            </h1>
                            <div class="badge" :class="statusClass">{{ project.status }}</div>
                        </div>
                        <p class="text-sm opacity-70 mt-1">{{ project.description }}</p>
                        <p class="text-xs mt-2">{{ formatDateRange(project.startDate, project.endDate) }}</p>
                    </div>

                    <div class="flex gap-2 items-start justify-end md:mt-0 mt-3">
                        <BaseButton @click="openTaskModal"
                            class-name="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-gray-100 dark:text-gray-800 font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Task
                        </BaseButton>
                    </div>
                </div>

                <div class="mb-6 flex flex-col sm:flex-row gap-4">
                    <BaseInput v-model="searchQuery" placeholder="Search tasks..." class="flex-1">
                        <template #icon-left>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </template>
                    </BaseInput>

                    <select v-model="filterStatus"
                        class="select select-bordered w-auto dark:text-gray-400 focus:outline-gray-300 focus:outline-3 focus:border-gray-300 dark:focus:outline-gray-700 dark:focus:outline-3 dark:focus:border-gray-600">
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div v-if="filteredTasks.length === 0" class="mt-8">
                    <EmptyState :title="searchQuery || filterStatus !== 'all' ? 'No matching tasks' : 'No tasks yet'"
                        :description="searchQuery || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Add your first task to this project'">
                        <template #action>
                            <BaseButton @click="openTaskModal" v-if="!searchQuery && filterStatus === 'all'"
                                class-name="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-gray-100 dark:text-gray-800 font-bold">
                                Add Task
                            </BaseButton>
                            <BaseButton @click="resetFilters"
                                class-name="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-400"
                                v-else>
                                Reset Filters
                            </BaseButton>
                        </template>
                    </EmptyState>
                </div>

                <div v-else>
                    <div class="grid grid-cols-1 gap-6">
                        <TaskItem v-for="task in filteredTasks" :key="task.id" :task="task"
                            @toggle-complete="toggleTaskComplete" @edit="openEditTaskModal" @delete="confirmDeleteTask" />
                    </div>
                </div>

                <TaskFormModal :is-open="isTaskModalOpen" :project-id="projectId" :task="selectedTask"
                    @close="closeTaskModal" @save="saveTask" />

                <ProjectFormModal :is-open="isProjectModalOpen" :project="project" @close="closeProjectModal"
                    @save="saveProject" />

                <dialog :open="isDeleteProjectConfirmOpen" class="modal modal-bottom sm:modal-middle">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Confirm Delete Project</h3>
                        <p class="py-4">Are you sure you want to delete this project? This action cannot be undone and will
                            also delete
                            all tasks associated with this project.</p>
                        <div class="modal-action">
                            <button class="btn" @click="isDeleteProjectConfirmOpen = false">Cancel</button>
                            <button class="btn btn-error" @click="deleteProject">Delete</button>
                        </div>
                    </div>
                    <form method="dialog" class="modal-backdrop">
                        <button @click="isDeleteProjectConfirmOpen = false">close</button>
                    </form>
                </dialog>

                <dialog :open="isDeleteTaskConfirmOpen" class="modal modal-bottom sm:modal-middle">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Confirm Delete Task</h3>
                        <p class="py-4">Are you sure you want to delete this task? This action cannot be undone.</p>
                        <div class="modal-action">
                            <button class="btn" @click="isDeleteTaskConfirmOpen = false">Cancel</button>
                            <button class="btn btn-error" @click="deleteTask">Delete</button>
                        </div>
                    </div>
                    <form method="dialog" class="modal-backdrop">
                        <button @click="isDeleteTaskConfirmOpen = false">close</button>
                    </form>
                </dialog>
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProjectStore } from '~/stores/project';
import { useTaskStore } from '~/stores/task';
import { formatDateRange } from '~/utils/date';
import TaskItem from '~/components/TaskItem.vue';
import TaskFormModal from '~/components/TaskFormModal.vue';
import dayjs from 'dayjs';

const route = useRoute();
const projectId = route.params.id as string;

const projectStore = useProjectStore();
const taskStore = useTaskStore();

// Get project
const project = computed(() => {
    return projectStore.getProjectById(projectId);
});

// Status class
const statusClass = computed(() => {
    if (!project.value) return '';

    switch (project.value.status.toLowerCase()) {
        case 'active':
            return 'badge-info';
        case 'completed':
            return 'badge-success';
        case 'on hold':
            return 'badge-warning';
        default:
            return 'badge-secondary';
    }
});

// Filters
const searchQuery = ref('');
const filterStatus = ref('all');

function resetFilters() {
    searchQuery.value = '';
    filterStatus.value = 'all';
}

// Filtered tasks
const filteredTasks = computed(() => {
    return taskStore.tasks
        .filter(task => {
            // First filter by project
            if (task.projectId !== projectId) return false;

            // Then filter by search query
            const matchesSearch = !searchQuery.value ||
                task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()));

            // Then filter by completion status
            let matchesStatus = true;
            if (filterStatus.value === 'active') {
                matchesStatus = !task.completed;
            } else if (filterStatus.value === 'completed') {
                matchesStatus = task.completed;
            }

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }

            if (a.completed && b.completed) {
                const completedA = a.completedAt ? dayjs(a.completedAt) : dayjs(0);
                const completedB = b.completedAt ? dayjs(b.completedAt) : dayjs(0);
                return completedB.diff(completedA);
            }

            const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
            const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3;
            const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3;

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            const dayA = a.dueDate ? dayjs(a.dueDate) : null;
            const dayB = b.dueDate ? dayjs(b.dueDate) : null;

            if (dayA && dayB) return dayA.diff(dayB);
            if (dayA && !dayB) return -1;
            if (!dayA && dayB) return 1;

            return dayjs(b.createdAt).diff(dayjs(a.createdAt));
        });
});

// Task modal state
const isTaskModalOpen = ref(false);
const selectedTask = ref(null);

function openTaskModal() {
    selectedTask.value = null;
    isTaskModalOpen.value = true;
}

function openEditTaskModal(task: any) {
    selectedTask.value = task;
    isTaskModalOpen.value = true;
}

function closeTaskModal() {
    isTaskModalOpen.value = false;
    selectedTask.value = null;
}

// Project modal state
const isProjectModalOpen = ref(false);

function openEditProjectModal() {
    isProjectModalOpen.value = true;
}

function closeProjectModal() {
    isProjectModalOpen.value = false;
}

// Task operations
function toggleTaskComplete(taskId: string) {
    taskStore.toggleTaskComplete(taskId);
}

function saveTask(taskData: any) {
    if (selectedTask.value) {
        taskStore.updateTask(taskData);
    } else {
        taskStore.addTask(taskData);
    }
    closeTaskModal();
}

// Delete task confirmation
const isDeleteTaskConfirmOpen = ref(false);
const taskToDelete = ref('');

function confirmDeleteTask(taskId: string) {
    taskToDelete.value = taskId;
    isDeleteTaskConfirmOpen.value = true;
}

function deleteTask() {
    taskStore.deleteTask(taskToDelete.value);
    isDeleteTaskConfirmOpen.value = false;
    taskToDelete.value = '';
}

// Project operations
function saveProject(projectData: any) {
    projectStore.updateProject(projectData);
    closeProjectModal();
}

// Delete project confirmation
const isDeleteProjectConfirmOpen = ref(false);

function confirmDeleteProject() {
    isDeleteProjectConfirmOpen.value = true;
}

function deleteProject() {
    // Delete all associated tasks
    const tasksToDelete = taskStore.tasks.filter(task => task.projectId === projectId);
    tasksToDelete.forEach(task => taskStore.deleteTask(task.id));

    // Delete the project
    projectStore.deleteProject(projectId);

    isDeleteProjectConfirmOpen.value = false;
    navigateTo('/projects');
}
</script>