<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div class="rounded-full bg-base-200 p-6 mb-4">
            <slot name="icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content opacity-40" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </slot>
        </div>
        <h3 class="text-lg font-medium text-base-content">{{ title }}</h3>
        <p class="mt-1 text-sm text-base-content opacity-70">{{ description }}</p>
        <div class="mt-6">
            <slot name="action"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    title?: string
    description?: string
}>(), {
    title: 'No Data',
    description: 'There is currently no data to display.'
});
</script>