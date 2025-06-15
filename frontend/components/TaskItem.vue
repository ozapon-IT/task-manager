<template>
    <div class="card bg-base-100 shadow-md hover-lift card-transition" :class="{ 'opacity-60': task.completed }">
        <div class="card-body p-5">
            <div class="flex items-start gap-4">
                <input type="checkbox" :checked="task.completed" class="checkbox checkbox-success"
                    @change="$emit('toggle-complete', task.id)" />
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <h3 class="font-medium" :class="{ 'line-through': task.completed }">{{ task.title }}</h3>
                        <div class="dropdown dropdown-end">
                            <label tabindex="0"
                                class="btn btn-ghost btn-xs btn-circle dark:text-gray-400 light:hover:bg-gray-100/10 dark:hover:bg-gray-100/10 border-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </label>
                            <ul tabindex="0"
                                class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-40">
                                <li class="dark:text-gray-400"><a @click.prevent="$emit('edit', task)">Edit</a></li>
                                <li><a @click.prevent="$emit('delete', task.id)" class="text-error">Delete</a></li>
                            </ul>
                        </div>
                    </div>

                    <p v-if="task.description" class="text-sm opacity-80 mb-3">{{ task.description }}</p>

                    <div class="flex flex-wrap items-center gap-3">
                        <div class="badge badge-sm" :class="priorityClass">{{ task.priority }}</div>
                        <div v-if="!task.completed && task.dueDate"
                            class="badge badge-sm badge-outline inline-flex items-center gap-2 whitespace-nowrap"
                            :class="dueBadgeClass">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 flex-shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{{ formatDate(task.dueDate) }}</span>
                        </div>
                        <div v-else-if="task.completed && task.completedAt"
                            class="badge badge-sm badge-success inline-flex items-center gap-2 whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 flex-shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{{ formatDateTime(task.completedAt) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from '~/utils/date';
import type { Task } from '~/types/index.ts';

const props = defineProps<{
    task: Task
}>();

const priorityClass = computed(() => {
    switch (props.task.priority.toLowerCase()) {
        case 'high':
            return 'badge-error';
        case 'medium':
            return 'badge-warning';
        case 'low':
            return 'badge-info';
        default:
            return 'badge-secondary';
    }
});

defineEmits(['toggle-complete', 'edit', 'delete']);

const dueBadgeClass = computed(() => {
    if (!props.task.dueDate) return 'badge-neutral';

    const today = new Date();
    const due = new Date(props.task.dueDate);
    const diff = ((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1; // 日数差

    if (diff < 1) return 'badge-error';           // 1日以内or期限超過
    if (diff <= 3) return 'badge-warning';        // 3日以内
    return 'badge-gray';                          // それ以外
});

</script>