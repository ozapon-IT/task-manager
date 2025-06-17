<template>
    <div>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold mb-2 dark:text-gray-400">Dashboard</h1>
                <p class="text-sm opacity-70">Your task overview and summary</p>
            </div>
        </div>

        <ClientOnly>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div class="stat bg-base-100 shadow-md rounded-box p-6">
                    <div class="stat-title mb-2 text-lg">Active Projects</div>

                    <div class="flex justify-between items-center gap-4 mb-2">
                        <div class="text-3xl font-bold text-info">{{ activeProjects }}</div>

                        <div class="text-info">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>

                    <div class="stat-desc">{{ completionRate }}% completion rate</div>
                </div>

                <div class="stat bg-base-100 shadow-md rounded-box p-6">
                    <div class="stat-title mb-2 text-lg">Completed Tasks</div>

                    <div class="flex justify-between items-center gap-4 mb-2">
                        <div class="text-3xl font-bold text-success">{{ completedTasks }}</div>

                        <div class="text-success">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>

                    <div class="stat-desc">{{ totalTasks }} total tasks</div>
                </div>

                <div class="stat bg-base-100 shadow-md rounded-box p-6">
                    <div class="stat-title mb-2 text-lg">Due Soon</div>

                    <div class="flex justify-between items-center gap-4 mb-2">
                        <div class="text-3xl font-bold text-error">{{ tasksDueSoon }}</div>

                        <div class="text-error">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div class="stat-desc">Tasks due in the next 3 days</div>
                </div>
            </div>

            <div class="divider mb-8">Recent Projects</div>

            <div v-if="recentProjects.length === 0" class="mt-8">
                <EmptyState title="No projects yet" description="Create your first project to get started">
                    <template #action>
                        <BaseButton @click="navigateTo('/projects')"
                            class-name="bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 text-gray-100 dark:text-gray-800">
                            Go to Projects</BaseButton>
                    </template>
                </EmptyState>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <ProjectCard v-for="project in recentProjects" :key="project.id" :project="project"
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
                        <button
                            class="btn bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-400"
                            @click="isDeleteConfirmOpen = false">Cancel</button>
                        <button class="btn btn-error text-gray-100 dark:text-gray-800 font-bold"
                            @click="deleteProject">Delete</button>
                    </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button @click="isDeleteConfirmOpen = false">close</button>
                </form>
            </dialog>

            <div class="divider mb-8">Tasks Due Soon</div>

            <div v-if="tasksForDashboard.length === 0" class="mt-8">
                <EmptyState title="No upcoming tasks" description="You're all caught up!" />
            </div>
            <div v-else class="mb-8">
                <div v-for="task in tasksForDashboard" :key="task.id" class="mb-6">
                    <TaskItem :task="task" @toggle-complete="toggleTaskComplete" @edit="openEditTaskModal"
                        @delete="deleteTask" />
                </div>
            </div>

            <TaskFormModal :is-open="isTaskModalOpen" :project-id="selectedProjectId" :task="selectedTask"
                @close="closeTaskModal" @save="saveTask" />
        </ClientOnly>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProjectStore } from '~/stores/project';
import { useTaskStore } from '~/stores/task';
import dayjs from 'dayjs';

const projectStore = useProjectStore();
const taskStore = useTaskStore();

// Initialize with some example data
onMounted(() => {
    if (projectStore.projects.length === 0) {
        if (process.env.NODE_ENV === 'development') {
            projectStore.initializeWithExamples();
            taskStore.initializeWithExamples();
        }
    }
});

// Computed properties for dashboard stats
const activeProjects = computed(() => {
    return projectStore.projects.filter(p => p.status === 'Active').length;
});

const totalProjects = computed(() => projectStore.projects.length);

const completionRate = computed(() => {
    if (totalProjects.value === 0) return 0;
    const completedProjects = projectStore.projects.filter(p => p.status === 'Completed').length;
    return Math.round((completedProjects / totalProjects.value) * 100);
});

const totalTasks = computed(() => taskStore.tasks.length);

const completedTasks = computed(() => taskStore.tasks.filter(t => t.completed).length);

const tasksDueSoon = computed(() => {
    const today = dayjs().startOf('day');
    const inThreeDays = today.add(2, 'day').endOf('day');

    return taskStore.tasks.filter(task => {
        if (!task.dueDate || task.completed) return false;
        const due = dayjs(task.dueDate);
        return due.isSameOrAfter(today) && due.isSameOrBefore(inThreeDays);
    }).length;
});

// Get recent projects for display
const recentProjects = computed(() => {
    return [...projectStore.projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
});

// Get tasks due soon for display
const tasksForDashboard = computed(() => {
    const threeDaysFromNow = dayjs().add(2, 'day');
    return [...taskStore.tasks]
        .filter(task => {
            if (!task.dueDate || task.completed) return false;
            return dayjs(task.dueDate).isBefore(threeDaysFromNow);
        })
        .sort((a, b) => {
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

            return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
        })
        .slice(0, 5);
});

// Helper to get task count for a project
function getTasksCountForProject(projectId: string) {
    return taskStore.tasks.filter(task => task.projectId === projectId).length;
}

// Navigation
function navigateToProject(projectId: string) {
    navigateTo(`/projects/${projectId}`);
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

// Task modal state
const isTaskModalOpen = ref(false);
const selectedTask = ref(null);
const selectedProjectId = ref('');

function openEditTaskModal(task: any) {
    selectedTask.value = task;
    selectedProjectId.value = task.projectId;
    isTaskModalOpen.value = true;
}

function closeTaskModal() {
    isTaskModalOpen.value = false;
    selectedTask.value = null;
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

function deleteTask(taskId: string) {
    taskStore.deleteTask(taskId);
}
</script>