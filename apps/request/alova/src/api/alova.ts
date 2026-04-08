/**
 * 统一请求实例封装
 * @author Ateng
 * @date 2026-04-08
 */
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import VueHook from 'alova/vue';

const getToken = (): string => {
    return localStorage.getItem('token') || '';
};

export const alovaInstance = createAlova({
    statesHook: VueHook,
    requestAdapter: adapterFetch(),
    baseURL: 'https://jsonplaceholder.typicode.com',
    responded: response => response.json(),
    beforeRequest(method) {
        const token = getToken();

        if (token) {
            method.config.headers = {
                ...method.config.headers,
                Authorization: `Bearer ${token}`
            };
        }
    }
});