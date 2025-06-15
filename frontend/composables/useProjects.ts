import { storeToRefs } from 'pinia';
import { useProjectStore } from '~/stores/project';

export function useProjects() {
    const projectStore = useProjectStore();
    const { projects } = storeToRefs(projectStore);

    const activeProjects = computed(() => {
        return projects.value.filter(p => p.status === 'Active');
    });

    const completedProjects = computed(() => {
        return projects.value.filter(p => p.status === 'Completed');
    });

    const onHoldProjects = computed(() => {
        return projects.value.filter(p => p.status === 'On Hold');
    });

    function getProject(id: string) {
        return projectStore.getProjectById(id);
    }

    function createProject(projectData: any) {
        return projectStore.addProject(projectData);
    }

    function updateProject(projectData: any) {
        return projectStore.updateProject(projectData);
    }

    function removeProject(id: string) {
        projectStore.deleteProject(id);
    }

    return {
        projects,
        activeProjects,
        completedProjects,
        onHoldProjects,
        getProject,
        createProject,
        updateProject,
        removeProject
    };
}