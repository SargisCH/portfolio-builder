export interface ProjectResponse {
    title: string;
    id?: string;
    description: string;
    tools: string;
    date: string;
    location?: string;
    renders: string[];
    thumbs: string[];
    sortIndex?: number;
}
