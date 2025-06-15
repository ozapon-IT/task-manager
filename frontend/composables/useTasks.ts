import { storeToRefs } from 'pinia';
import { useTaskStore } from '~/stores/task';
import dayjs from 'dayjs';

export function useTasks(projectId?: string) {
    const taskStore = useTaskStore();
    const { tasks } = storeToRefs(taskStore);

    const projectTasks = computed(() => {
        if (!projectId) return tasks.value;
        return tasks.value.filter(t => t.projectId === projectId);
    });

    const activeTasks = computed(() => {
        return projectTasks.value.filter(t => !t.completed);
    });

    const completedTasks = computed(() => {
        return projectTasks.value.filter(t => t.completed);
    });

    const highPriorityTasks = computed(() => {
        return activeTasks.value.filter(t => t.priority === 'High');
    });

    const dueSoonTasks = computed(() => {
        const threeDaysFromNow = dayjs().add(3, 'day');
        return activeTasks.value.filter(task => {
            if (!task.dueDate) return false;
            return dayjs(task.dueDate).isBefore(threeDaysFromNow);
        });
    });

    const overdueTasks = computed(() => {
        const today = dayjs();
        return activeTasks.value.filter(task => {
            if (!task.dueDate) return false;
            return dayjs(task.dueDate).isBefore(today, 'day');
        });
    });

    function getTask(id: string) {
        return taskStore.getTaskById(id);
    }

    function createTask(taskData: any) {
        return taskStore.addTask(taskData);
    }

    function updateTask(taskData: any) {
        return taskStore.updateTask(taskData);
    }

    function removeTask(id: string) {
        taskStore.deleteTask(id);
    }

    function toggleComplete(id: string) {
        taskStore.toggleTaskComplete(id);
    }

    return {
        tasks: projectTasks,
        activeTasks,
        completedTasks,
        highPriorityTasks,
        dueSoonTasks,
        overdueTasks,
        getTask,
        createTask,
        updateTask,
        removeTask,
        toggleComplete
    };
}