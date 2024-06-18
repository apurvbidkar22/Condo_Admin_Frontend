import { BaseResponse, SERVICE } from "@/models/BaseModel";
import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";

const axiosInstance: AxiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(async config => {
    const session = await getSession();
    config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
    config.headers["idToken"] = session?.idToken;
    return config;
})

const handleError = (error: any) => {
    if (error.response) {
        throw error.response.data;
    } else {
        throw error;
    }
};

const serviceUrls = {
    [SERVICE.USERS]: process.env.NEXT_PUBLIC_BACKEND_USERS,
    [SERVICE.BUILDINGS]: process.env.NEXT_PUBLIC_BACKEND_BUILDINGS,
    [SERVICE.AMENITIES]: process.env.NEXT_PUBLIC_BACKEND_AMENITIES,
    [SERVICE.POLICIES]: process.env.NEXT_PUBLIC_BACKEND_POLICIES,
};

const makeRequest = async <T>(
    service: SERVICE,
    method: string,
    url: string,
    data?: Record<string, any>,
): Promise<BaseResponse<T>> => {
    const baseUrl = serviceUrls[service];
    const fullUrl = `${baseUrl}${url}`;

    try {
        const response = await axiosInstance.request<BaseResponse<T>>({
            method,
            url: fullUrl,
            data,
        });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const ApiService = {
    post: async <T>(service: SERVICE, url: string, data: Record<string, any>): Promise<BaseResponse<T>> =>
        makeRequest<T>(service, 'post', url, data),

    put: async <T>(service: SERVICE, url: string, data: Record<string, any>): Promise<BaseResponse<T>> =>
        makeRequest<T>(service, 'put', url, data),

    get: async <T>(service: SERVICE, url: string): Promise<BaseResponse<T>> =>
        makeRequest<T>(service, 'get', url),

    patch: async <T>(service: SERVICE, url: string, data: Record<string, any>): Promise<BaseResponse<T>> =>
        makeRequest<T>(service, 'patch', url, data),

    delete: async <T>(service: SERVICE, url: string): Promise<BaseResponse<T>> =>
        makeRequest<T>(service, 'delete', url),
};