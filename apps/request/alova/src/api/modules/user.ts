/**
 * 用户接口定义
 * @author Ateng
 * @date 2026-04-08
 */
import { alovaInstance } from '../alova';

export interface PostItem {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export const getPostList = (params: { userId?: number }) => {
    return alovaInstance.Get<PostItem[]>('/posts', {
        params,
        cacheFor: 1000 * 60 * 5
    });
};

export const getPostListWithCache = (params: { userId?: number }) => {
    return alovaInstance.Get('/posts', {
        params,
        cacheFor: 1000 * 60 * 5
    });
};

export const getPostDetail = (id: number) => {
    return alovaInstance.Get<PostItem>(`/posts/${id}`);
};

export const createPost = (data: {
    title: string;
    body: string;
    userId: number;
}) => {
    return alovaInstance.Post<PostItem>('/posts', data);
};

export const createPostWithQuery = (
    query: { draft?: boolean },
    data: {
        title: string;
        body: string;
        userId: number;
    }
) => {
    return alovaInstance.Post<PostItem>('/posts', data, {
        params: query
    });
};