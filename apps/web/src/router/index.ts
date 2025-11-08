import { Role } from '@workspace/shared';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { AuthMeta, useAuthGuard, useLoadingIndicator } from './middlewares';
import { routes } from './routes';

declare module 'vue-router' {
    export interface RouteMeta {
        auth: AuthMeta;
        roles?: Role[];
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

useLoadingIndicator(router);
useAuthGuard(router);

export default router;
