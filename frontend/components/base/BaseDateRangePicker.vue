<template>
    <div class="form-control w-full">
        <label v-if="label" class="label">
            <span class="label-text">{{ label }}</span>
            <span v-if="required" class="text-error">*</span>
        </label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
                <label class="label">
                    <span class="label-text text-sm">Start Date</span>
                </label>
                <input :value="startDate" type="date" :min="minDate" :max="endDate || maxDate"
                    class="input input-bordered w-full" :class="{ 'input-error': startDateError }"
                    @input="updateStartDate(($event.target as HTMLInputElement).value)" />
                <label v-if="startDateError" class="label">
                    <span class="label-text-alt text-error">{{ startDateError }}</span>
                </label>
            </div>

            <div>
                <label class="label">
                    <span class="label-text text-sm">End Date</span>
                </label>
                <input :value="endDate" type="date" :min="startDate || minDate" :max="maxDate"
                    class="input input-bordered w-full" :class="{ 'input-error': endDateError }"
                    @input="updateEndDate(($event.target as HTMLInputElement).value)" />
                <label v-if="endDateError" class="label">
                    <span class="label-text-alt text-error">{{ endDateError }}</span>
                </label>
            </div>
        </div>

        <div v-if="startDate && endDate" class="mt-2 p-3 bg-base-200 rounded-lg">
            <div class="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-info" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Duration: {{ formatDateRange(startDate, endDate) }}</span>
            </div>
        </div>

        <label v-if="helperText && !startDateError && !endDateError" class="label">
            <span class="label-text-alt">{{ helperText }}</span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import dayjs from 'dayjs';

interface Props {
    startDate?: string
    endDate?: string
    label?: string
    required?: boolean
    minDate?: string
    maxDate?: string
    helperText?: string
}

const props = withDefaults(defineProps<Props>(), {
    startDate: '',
    endDate: '',
    label: '',
    required: false,
    minDate: '',
    maxDate: '',
    helperText: ''
});


const emit = defineEmits(['update:startDate', 'update:endDate', 'validate']);

const startDateError = ref('');
const endDateError = ref('');

function updateStartDate(value: string) {
    startDateError.value = '';

    if (value && props.endDate && dayjs(value).isAfter(dayjs(props.endDate))) {
        startDateError.value = 'Start date must be before end date';
        emit('validate', false);
        return;
    }

    emit('update:startDate', value);
    emit('validate', true);
}

function updateEndDate(value: string) {
    endDateError.value = '';

    if (value && props.startDate && dayjs(value).isBefore(dayjs(props.startDate))) {
        endDateError.value = 'End date must be after start date';
        emit('validate', false);
        return;
    }

    emit('update:endDate', value);
    emit('validate', true);
}

function formatDateRange(start: string, end: string): string {
    const startDay = dayjs(start);
    const endDay = dayjs(end);
    const duration = endDay.diff(startDay, 'day') + 1;

    return `${duration} day${duration !== 1 ? 's' : ''} (${startDay.format('MMM D')} - ${endDay.format('MMM D, YYYY')})`;
}

// Validate on prop changes
watch([() => props.startDate, () => props.endDate], () => {
    if (props.startDate && props.endDate) {
        if (dayjs(props.startDate).isAfter(dayjs(props.endDate))) {
            startDateError.value = 'Start date must be before end date';
            endDateError.value = 'End date must be after start date';
            emit('validate', false);
        } else {
            startDateError.value = '';
            endDateError.value = '';
            emit('validate', true);
        }
    }
});
</script>