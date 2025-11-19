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
    // mixed<File>()
    //     .required('Required')
    //     .test('is-valid-type', 'Not a valid image type', (value) =>
    //         isValidFileType(value && value.name.toLowerCase(), 'image')
    //     )
    thumbs: array().optional(),
    // mixed<File>()
    //     .required('Required')
    //     .test('is-valid-type', 'Not a valid image type', (value) =>
    //         isValidFileType(value && value.name.toLowerCase(), 'image')
    //     )
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
