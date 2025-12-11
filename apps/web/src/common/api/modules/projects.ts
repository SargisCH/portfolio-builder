import { ProjectResponse, ProjectCreateType, ProjectUpdateDto } from '@workspace/shared';

import { $axios } from '../client';

const buildFormData = (data: ProjectCreateType | ProjectUpdateDto) => {
    const thumbs = data.thumbs;
    const renders = data.renders;
    delete data.thumbs;
    delete data.renders;
    const formData = new FormData();
    for (const i in data) {
        formData.append(i, data[i]);
    }
    thumbs.forEach((file) => {
        formData.append('thumbs', file);
    });

    renders.forEach((file) => {
        formData.append('renders', file);
    });
    return formData;
};
export async function getProject(id: string) {
    return await $axios.get<ProjectResponse>(`/projects/${id}`);
}

export async function updateProject(id: string, data: ProjectUpdateDto) {
    const formData = buildFormData(data);
    return await $axios.put<ProjectResponse>(`/projects/${id}`, formData);
}

export async function createOne(data: ProjectCreateType) {
    const formData = buildFormData(data);
    return await $axios.post<ProjectResponse>('/projects', formData);
}

export async function getProjects() {
    return await $axios.get<ProjectResponse[]>(`/projects/`);
}
export async function deleteOne(id: string) {
    return await $axios.delete<number>(`/projects/${id}`);
}
