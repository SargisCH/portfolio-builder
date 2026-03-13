import { array, date, mixed, number, object, ObjectSchema, setLocale, string } from 'yup';
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
    date: string().optional(),
    location: string().optional(),
    area: string().optional(),
    sortIndex: number().optional(),
    renders: array().transform((value, originalValue) => {
        if (!Array.isArray(originalValue)) return [];
        return value;
    }).optional(),
    thumbs: array().transform((value, originalValue) => {
        if (!Array.isArray(originalValue)) return [];
        return value;
    }).optional(),
});
export const projectUpdateSchema: ObjectSchema<ProjectUpdateDto> = object().shape({
    title: string().optional(),
    description: string().optional(),
    tools: string().optional(),
    date: string().optional(),
    location: string().optional(),
    area: string().optional(),
    renders: array().optional(),
    thumbs: array().optional(),
    sortIndex: number().optional(),
});

@UseSchema(projectCreateSchema)
export class ProjectCreateDto {
    title: string;
    description?: string;
    tools?: string;
    date?: string;
    location?: string;
    area?: string;
    renders?: File[];
    thumbs?: File[];
}

export type ProjectCreateType = Omit<ProjectCreateDto, 'renders' | 'thumbs'> & {
    thumbs?: File[];
    renders?: File[];
};
export type ProjectUpdateDto = {
    thumbs?: string[];
    renders?: string[];
    title?: string;
    description?: string;
    tools?: string;
    date?: string;
    location?: string;
    area?: string;
    sortIndex?: number;
};

export type UploadImagesResponse = {
    thumbs: string[];
    renders: string[];
};
