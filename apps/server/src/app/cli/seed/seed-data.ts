import { Role, UserCreateDto } from '@workspace/shared';

export const usersSeedData: (rootPassword: string) => UserCreateDto[] = (rootPassword: string) => {
    return [
        {
            email: 'admin@admin.com',
            password: rootPassword,
            role: Role.Admin,
            firstName: 'John',
            lastName: 'Doe',
        },
    ];
};
