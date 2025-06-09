<template>
    <div class="card bg-base-100 shadow-md hover-lift mb-4">
        <div class="card-body p-6">
            <div class="flex justify-between items-start mb-4">
                <h2 class="card-title text-lg dark:text-gray-400" :class="{ 'line-through opacity-50': project.completed }">
                    {{ project.title }}
                </h2>
                <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-xs btn-circle dark:text-gray-400 light:hover:bg-gray-100/10 dark:hover:bg-gray-100/10 border-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </label>
                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                        <li class="dark:text-gray-400"><a @click.prevent="$emit('edit', project)">Edit</a></li>
                        <li><a @click.prevent="$emit('delete', project.id)" class="text-error">Delete</a></li>
                    </ul>
                </div>
            </div>

            <p class="text-sm opacity-70 mt-2 mb-4">{{ project.description }}</p>

            <div class="flex justify-between items-center mt-4 text-sm dark:text-gray-400">
                <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {{ tasksCount }} tasks
                </span>
                <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(project.createdAt) }}
                </span>
            </div>

            <div class="mt-6 flex justify-between items-center">
                <div class="badge" :class="statusClass">{{ project.status }}</div>
                <div class="card-actions justify-end">
                    <BaseButton size="sm" @click="$emit('view', project.id)" class-name="bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 text-gray-100 dark:text-gray-800">View Details</BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from '~/utils/date';
import type { Project } from '~/types/index.ts';

const props = withDefaults(defineProps<{
    project: Project
    tasksCount?: number
}>(), {
    tasksCount: 0
});

const statusClass = computed(() => {
    switch (props.project.status.toLowerCase()) {
        case 'active':
            return 'badge-warning';
        case 'completed':
            return 'badge-success';
        case 'on hold':
            return 'badge-info';
        default:
            return 'badge-secondary';
    }
});

defineEmits(['view', 'edit', 'delete']);
</script>