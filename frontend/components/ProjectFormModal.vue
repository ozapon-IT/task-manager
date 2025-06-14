<template>
    <dialog :open="isOpen" class="modal sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg dark:text-gray-400">{{ isEdit ? 'Edit Project' : 'Create New Project' }}</h3>
            <form @submit.prevent="handleSubmit" novalidate>
                <div class="py-4">
                    <BaseInput v-model="form.title" label="Project Title" placeholder="Enter project title" required
                        :error="errors.title"/>

                    <div class="mt-4">
                        <label class="label mb-2">
                            <span class="label-text">Description</span>
                        </label>
                        <textarea v-model="form.description" class="textarea textarea-bordered w-full focus:outline-gray-300 focus:outline-3 focus:border-gray-300 dark:focus:outline-gray-700 dark:focus:outline-3 dark:focus:border-gray-600 dark:placeholder-gray-600"
                            placeholder="Enter project description" rows="3"></textarea>
                        <label v-if="errors.description" class="label">
                            <span class="label-text-alt text-error">{{ errors.description }}</span>
                        </label>
                    </div>

                    <div class="mt-4">
                        <label class="label mb-2">
                            <span class="label-text">Status</span>
                        </label>
                        <select v-model="form.status" class="select select-bordered w-full focus:outline-gray-300 focus:outline-3 focus:border-gray-300 dark:focus:outline-gray-700 dark:focus:outline-3 dark:focus:border-gray-600">
                            <option value="Active">Active</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div class="modal-action">
                    <button type="button" class="btn bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-400" @click="$emit('close')">Cancel</button>
                    <button type="submit" class="btn bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-gray-100 dark:text-gray-800 font-bold" :disabled="isSubmitting">
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import type { Project } from '~/types/index.ts';
import BaseInput from '~/components/base/BaseInput.vue';

const props = withDefaults(defineProps<{
    isOpen: boolean;
    project?: Project | null;
}>(), {
    project: null
});

const emit = defineEmits(['close', 'save']);

const isEdit = computed(() => !!props.project);
const isSubmitting = ref(false);

const defaultForm = {
    title: '',
    description: '',
    status: 'Active'
};

const form = reactive({ ...defaultForm });
const errors = reactive({
    title: '',
    description: ''
});

watch(() => props.project, (newProject) => {
    if (newProject) {
        form.title = newProject.title;
        form.description = newProject.description || '';
        form.status = newProject.status;
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
        errors.title = 'Project title is required';
        isValid = false;
    } else if (form.title.length > 100) {
        errors.title = 'Project title must be less than 100 characters';
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
        const projectData = {
            ...form,
            id: props.project?.id,
        };

        emit('save', projectData);
        emit('close');
    } catch (error) {
        console.error('Error saving project:', error);
    } finally {
        isSubmitting.value = false;
    }
}
</script>