import { Permission } from "./ManageUsersModel";

export enum USER_STATUS {
    Active = "Active",
    InActive = "In Active"
}

export interface SignInUser {
    username: string;
    password: string;
}

export interface IResetPassword {
    id?: string;
    newPassword: string;
    oldPassword?: string;
    confirmPassword?: string;
}

export interface IForgotPassword {
    email?: string;
    newPassword: string;
    confirmationCode?: string;
    confirmPassword?: string;
}

export interface AuthUser {
    id: string,
    name: string,
    email: string,
    roleName: string,
    isPasswordReset: boolean,
    permissions: Permission[]
}

export interface LoginResponse {
    idToken: string,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    user: AuthUser
}