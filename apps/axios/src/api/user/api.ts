import type {UserInfo, UserPageQuery} from './types'
import type {AxiosResponse} from "axios";
import type {PageResult} from "@/services/http";
import {request} from '@/services/http'

/**
 * 获取用户分页列表
 */
export function getUserPage(params: UserPageQuery): Promise<PageResult<UserInfo>> {
    return request<PageResult<UserInfo>>({
        url: '/user/page',
        method: 'GET',
        params: params
    })
}

/**
 * 获取用户列表
 */
export function getUserList(): Promise<UserInfo[]> {
    return request<UserInfo[]>({
        url: '/user/list',
        method: 'GET'
    })
}

/**
 * 获取单个用户详情
 */
export function getUserDetail(id: number | string): Promise<UserInfo> {
    return request<UserInfo>({
        url: `/user/${id}`,
        method: 'GET'
    })
}

/**
 * 创建用户
 */
export function createUser(data: Omit<UserInfo, "id">): Promise<void> {
    return request<void>({
        url: `/user/`,
        method: 'POST',
        data: data
    })
}

/**
 * 修改用户
 */
export function updateUser(id: number | string, data: UserInfo): Promise<void> {
    return request<void>({
        url: `/user/${id}`,
        method: 'PUT',
        data: data
    })
}

/**
 * 部分修改用户
 */
export function patchUser(id: number | string, data: Partial<UserInfo>): Promise<void> {
    return request<void>({
        url: `/user/${id}`,
        method: 'PATCH',
        data: data
    })
}

/**
 * 删除用户
 */
export function deleteUser(id: number | string): Promise<void> {
    return request<void>({
        url: `/user/${id}`,
        method: 'DELETE'
    })
}

/**
 * 请求外部接口
 */
export function getForExt(): Promise<AxiosResponse> {
    return request<AxiosResponse>({
        baseURL: "http://192.168.3.45:12007",
        timeout: 2000,
        url: `/user/1`,
        method: 'GET',
        skipAuth: true,
        raw: true,
    })
}

/**
 * 下载外部文件
 */
export function downloadFileForRustFS(): Promise<AxiosResponse<Blob>> {
    return request<AxiosResponse<Blob>>({
        timeout: 2000,
        url: `http://175.178.193.128:20034/kongyu/plugins/rabbitmq_delayed_message_exchange-4.0.2.ez`,
        method: 'GET',
        responseType: "blob",
        skipAuth: true,
        raw: true
    })
}
