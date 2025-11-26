import { config } from '@/config';
import axios from 'axios';
console.log('config', config);
export const $axios = axios.create({
    baseURL: `${config.api.host}:${config.api.port}/api`,
    withCredentials: true,
});

export function setAuthorizationToken(token: string): void {
    $axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthorizationToken(): void {
    $axios.defaults.headers.common['Authorization'] = undefined;
}
