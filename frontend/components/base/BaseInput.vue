<template>
    <div class="form-control w-full">
        <label v-if="label" class="label mb-2" :for="id">
            <span class="label-text">{{ label }}</span>
            <span v-if="required" class="text-error">*</span>
        </label>
        <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled"
            :required="required" :class="[
                'input',
                'w-full',
                variant ? `input-${variant}` : 'input-bordered',
                { 'input-error': error },
                size ? `input-${size}` : '',
                'focus:outline-gray-300 focus:outline-3 focus:border-gray-300 dark:focus:outline-gray-700 dark:focus:outline-3 dark:focus:border-gray-600',
                'dark:placeholder-gray-600',
                className
            ]" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            @blur="$emit('blur', $event)" @focus="$emit('focus', $event)" />
        <label v-if="error || helperText" class="label">
            <span :class="['label-text-alt', error ? 'text-error' : '']">
                {{ error || helperText }}
            </span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    modelValue: string | number
    id?: string
    label?: string
    type?: string
    placeholder?: string
    variant?: '' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
    size?: '' | 'xs' | 'sm' | 'md' | 'lg'
    disabled?: boolean
    required?: boolean
    error?: string
    helperText?: string
    className?: string
}>(), {
    modelValue: '',
    label: '',
    type: 'text',
    placeholder: '',
    variant: '',
    size: '',
    disabled: false,
    required: false,
    error: '',
    helperText: '',
    className: ''
});


const internalId = ref('');

onMounted(() => {
    // SSR回避のため、クライアントでのみ生成
    if (!props.id) {
        internalId.value = `input-${Math.random().toString(36).substring(2, 9)}`;
    }
});

const computedId = computed(() => props.id || internalId.value);

defineEmits(['update:modelValue', 'blur', 'focus']);
</script>