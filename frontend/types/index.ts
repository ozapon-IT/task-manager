// type ProjectStatus = 'active' | 'on hold' | 'completed';
// type TaskPriority = 'low' | 'medium' | 'high';

export interface Project {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    completed: boolean;
    startDate?: string;
    endDate?: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    completed: boolean;
    projectId: string;
    createdAt: string;
    startDate?: string;
    endDate?: string;
    completedAt?: string;
}