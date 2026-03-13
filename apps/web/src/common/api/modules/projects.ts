import { ProjectResponse, ProjectCreateType, ProjectUpdateDto, UploadImagesResponse } from '@workspace/shared';

import { $axios } from '../client';

const buildFormData = (data: ProjectCreateType) => {
    const thumbs = (data.thumbs as File[]) || [];
    const renders = (data.renders as File[]) || [];
    delete data.thumbs;
    delete data.renders;
    const formData = new FormData();
    for (const i in data) {
        if (data[i] !== undefined && data[i] !== null) {
            formData.append(i, data[i] as string | Blob);
        }
    }
    if (thumbs.length === 0) {
        formData.append('thumbs', '');
    } else {
        thumbs.forEach((file) => formData.append('thumbs', file));
    }
    if (renders.length === 0) {
        formData.append('renders', '');
    } else {
        renders.forEach((file) => formData.append('renders', file));
    }
    return formData;
};

export async function getProject(id: string) {
    return await $axios.get<ProjectResponse>(`/projects/${id}`);
}

export async function uploadImages(id: string, data: { thumbs: File[]; renders: File[] }) {
    const formData = new FormData();
    if (data.thumbs.length === 0) {
        formData.append('thumbs', '');
    } else {
        data.thumbs.forEach((f) => formData.append('thumbs', f));
    }
    if (data.renders.length === 0) {
        formData.append('renders', '');
    } else {
        data.renders.forEach((f) => formData.append('renders', f));
    }
    return await $axios.post<UploadImagesResponse>(`/projects/${id}/upload`, formData);
}

export async function updateProject(id: string, data: ProjectUpdateDto) {
    return await $axios.put<ProjectResponse>(`/projects/${id}`, data);
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
