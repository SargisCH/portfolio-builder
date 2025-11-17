import { array, date, object, ObjectSchema, setLocale, string } from 'yup';
import { UseSchema, yupLocale } from '@workspace/shared';

setLocale(yupLocale);

export const projectCreateSchema: ObjectSchema<ProjectCreateDto> = object().shape({
    title: string().required(),
    description: string().optional(),
    tools: string().optional(),
    date: string().required(),
    location: string().optional(),
    renders: array(string()),
    thumbs: array(string()),
});

@UseSchema(projectCreateSchema)
export class ProjectCreateDto {
    title: string;
    description?: string;
    tools?: string;
    date: string;
    location?: string;
    renders: string[];
    thumbs: string[];
}
