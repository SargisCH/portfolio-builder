import { array, date, mixed, object, ObjectSchema, setLocale, string } from 'yup';
import { UseSchema, yupLocale } from '@workspace/shared';

setLocale(yupLocale);

const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

function isValidFileType(fileName: string, fileType: string) {
    return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

export const projectCreateSchema: ObjectSchema<ProjectCreateDto> = object().shape({
    title: string().required(),
    description: string().optional(),
    tools: string().optional(),
    date: string().required(),
    location: string().optional(),
    renders: array().optional(),
    thumbs: array().optional(),
});
export const projectUpdateSchema: ObjectSchema<ProjectUpdateDto> = object().shape({
    title: string().optional(),
    description: string().optional(),
    tools: string().optional(),
    date: string().optional(),
    location: string().optional(),
    renders: array().optional(),
    thumbs: array().optional(),
});

@UseSchema(projectCreateSchema)
export class ProjectCreateDto {
    title: string;
    description?: string;
    tools?: string;
    date: string;
    location?: string;
    renders: File[];
    thumbs: File[];
}

export type ProjectCreateType = Omit<ProjectCreateDto, 'renders' | 'thumbs'> & {
    thumbs: File[];
    renders: File[];
};
export type ProjectUpdateDto = {
    thumbs?: File[];
    renders?: File[];
    title?: string;
    description?: string;
    tools?: string;
    date?: string;
    location?: string;
};
