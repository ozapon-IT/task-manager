<template>
    <dialog :open="isOpen" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg">{{ isEdit ? 'Edit Project' : 'Create New Project' }}</h3>
            <form @submit.prevent="handleSubmit">
                <div class="py-4">
                    <BaseInput v-model="form.title" label="Project Title" placeholder="Enter project title" required
                        :error="errors.title" />

                    <div class="mt-4">
                        <label class="label">
                            <span class="label-text">Description</span>
                        </label>
                        <textarea v-model="form.description" class="textarea textarea-bordered w-full"
                            placeholder="Enter project description" rows="3"></textarea>
                        <label v-if="errors.description" class="label">
                            <span class="label-text-alt text-error">{{ errors.description }}</span>
                        </label>
                    </div>

                    <div class="mt-4">
                        <label class="label">
                            <span class="label-text">Status</span>
                        </label>
                        <select v-model="form.status" class="select select-bordered w-full">
                            <option value="Active">Active</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import type { Project } from '~/types/index.ts';

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
    } else if (form.title.length < 3) {
        errors.title = 'Project title must be at least 3 characters';
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