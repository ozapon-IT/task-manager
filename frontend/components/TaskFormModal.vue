<template>
    <dialog :open="isOpen" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg">{{ isEdit ? 'Edit Task' : 'Create New Task' }}</h3>
            <form @submit.prevent="handleSubmit">
                <div class="py-4">
                    <BaseInput v-model="form.title" label="Task Title" placeholder="Enter task title" required
                        :error="errors.title" />

                    <div class="mt-4">
                        <label class="label">
                            <span class="label-text">Description</span>
                        </label>
                        <textarea v-model="form.description" class="textarea textarea-bordered w-full"
                            placeholder="Enter task description" rows="2"></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label class="label">
                                <span class="label-text">Priority</span>
                            </label>
                            <select v-model="form.priority" class="select select-bordered w-full">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label class="label">
                                <span class="label-text">Due Date</span>
                            </label>
                            <input v-model="form.dueDate" type="date" class="input input-bordered w-full" />
                        </div>
                    </div>

                    <div class="form-control mt-4">
                        <label class="cursor-pointer label justify-start gap-2">
                            <input v-model="form.completed" type="checkbox" class="checkbox checkbox-primary" />
                            <span class="label-text">Mark as completed</span>
                        </label>
                    </div>
                </div>

                <div class="modal-action">
                    <button type="button" class="btn" @click="$emit('close')">Cancel</button>
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
                    </button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="$emit('close')">close</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { Task } from '~/types/index.ts';

const props = withDefaults(defineProps<{
    isOpen: boolean;
    projectId: string;
    task?: Task | null;
}>(), {
    task: null
});

const emit = defineEmits(['close', 'save']);

const isEdit = computed(() => !!props.task);
const isSubmitting = ref(false);

const defaultForm = {
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    completed: false
};

const form = reactive({ ...defaultForm });
const errors = reactive({
    title: '',
    description: ''
});

watch(() => props.task, (newTask) => {
    if (newTask) {
        form.title = newTask.title;
        form.description = newTask.description || '';
        form.priority = newTask.priority;
        form.dueDate = newTask.dueDate || '';
        form.completed = newTask.completed;
    } else {
        resetForm();
    }
}, { immediate: true });

watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        resetForm();
    }
});

function resetForm() {
    Object.assign(form, defaultForm);
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
    });
}

function validateForm() {
    let isValid = true;

    // Reset errors
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
    });

    if (!form.title.trim()) {
        errors.title = 'Task title is required';
        isValid = false;
    } else if (form.title.length > 100) {
        errors.title = 'Task title must be less than 100 characters';
        isValid = false;
    }

    if (form.description && form.description.length > 500) {
        errors.description = 'Description must be less than 500 characters';
        isValid = false;
    }

    return isValid;
}

async function handleSubmit() {
    if (!validateForm()) return;

    isSubmitting.value = true;

    try {
        const taskData = {
            ...form,
            id: props.task?.id,
            projectId: props.projectId
        };

        emit('save', taskData);
        emit('close');
    } catch (error) {
        console.error('Error saving task:', error);
    } finally {
        isSubmitting.value = false;
    }
}
</script>