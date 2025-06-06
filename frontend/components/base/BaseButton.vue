<template>
    <button :class="[
        'btn',
        variant ? `btn-${variant}` : '',
        size ? `btn-${size}` : '',
        { 'btn-block': block },
        { 'btn-outline': outline },
        { 'btn-disabled': disabled },
        { 'btn-loading': loading },
        className
    ]" :disabled="disabled || loading" :type="type" @click="$emit('click', $event)">
        <slot name="icon-left"></slot>
        <slot>Button</slot>
        <slot name="icon-right"></slot>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    variant?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost' | 'link' | '';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    block?: boolean;
    outline?: boolean;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}>();

defineEmits(['click']);
</script>