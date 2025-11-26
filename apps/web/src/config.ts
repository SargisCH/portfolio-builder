interface Config {
    defaultLocale: string;
    useCookies: boolean;
    api: {
        host: string;
        port: number;
    };
}
console.log('type of window', typeof window, import.meta.env.VITE_WEB_API_URL);
export const config: Config = {
    defaultLocale: import.meta.env.VITE_WEB_DEFAULT_LOCALE ?? 'en',
    useCookies: true,

    api: {
        host:
            (typeof window !== 'undefined' ? (window as any).WEB_API_URL : undefined) ||
            import.meta.env.VITE_WEB_API_URL ||
            'http://localhost',

        port:
            (typeof window !== 'undefined' ? (window as any).WEB_API_PORT : undefined) ||
            import.meta.env.VITE_WEB_API_PORT ||
            3000,
    },
};
