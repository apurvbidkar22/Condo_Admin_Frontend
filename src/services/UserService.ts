import { User, UsersResponse, RolePermission } from "@/models/ManageUsersModel";
import { ApiService } from "./BaseService";
import { BuildingsResponse } from "@/models/BuildingMediaModel";
import { BaseResponse, SERVICE } from "@/models/BaseModel";

export const getAllUsers = (page: number, limit: number): Promise<BaseResponse<UsersResponse>> => {
    return ApiService.get(SERVICE.USERS, `/users?page=${page}&limit=${limit}`);
};

export const getUser = (id: string): Promise<BaseResponse<User>> => {
    return ApiService.get(SERVICE.USERS, `/users/${id}`);
};

export const getRolePermissions = (): Promise<BaseResponse<RolePermission[]>> => {
    return ApiService.get(SERVICE.USERS, `/roles/permissions`);
};

export const createUser = (user: User): Promise<BaseResponse<void>> => {
    return ApiService.post(SERVICE.USERS, "/users", user);
};

export const editUser = (user: User): Promise<BaseResponse<void>> => {
    return ApiService.put(SERVICE.USERS, "/users", user);
};

export const deleteUser = (id: string): Promise<BaseResponse<void>> => {
    return ApiService.delete(SERVICE.USERS, `/users/${id}`);
};

export const validateEmail = (email: string): Promise<BaseResponse<void>> => {
    return ApiService.post(SERVICE.USERS, `/email/check`, { email });
};

export const assignBuildingsToUser = (objectId: string[], objectType: string, removePermission: boolean, state?: string, userId?: string,
): Promise<BaseResponse<void>> => {
    return ApiService.post(SERVICE.BUILDINGS, `/buildings/user-data-permission`, { userId, objectId, objectType, removePermission, state });
};

export const getAssignedBuildings = (page: number, limit: number, userId?: string): Promise<BaseResponse<BuildingsResponse>> => {
    return ApiService.get(SERVICE.BUILDINGS, `/buildings/user-assigned-buildings?page=${page}&limit=${limit}&userId=${userId}`);
};

export const assignLocationsToUser = (objectId: any, objectType: string, removePermission: boolean, state?: string, userId?: string,
): Promise<BaseResponse<void>> => {
    return ApiService.post(SERVICE.BUILDINGS, `/buildings/user-data-location-permission`, { userId, objectId, objectType, removePermission });
};