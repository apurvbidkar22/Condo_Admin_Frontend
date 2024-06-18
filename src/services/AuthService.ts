import { IForgotPassword, IResetPassword, LoginResponse, SignInUser } from "@/models/AuthModel";
import { ApiService, } from "./BaseService";
import { BaseResponse, SERVICE } from "@/models/BaseModel";

export const signIn = (values: SignInUser): Promise<BaseResponse<LoginResponse>> => {
    return ApiService.post(SERVICE.USERS, `/login`, { email: values.username, password: values.password });
};

export const refreshToken = (refreshToken: string, idToken: string): Promise<BaseResponse<void>> => {
    return ApiService.post(SERVICE.USERS, `/refresh-token`, { refreshToken, idToken });
};

export const resetPassword = (values: IResetPassword): Promise<BaseResponse<any>> => {
    const { id, newPassword, oldPassword } = values
    return ApiService.post(SERVICE.USERS, `/change-password `, { id, newPassword, oldPassword });
};

export const forgotPassword = (email: string): Promise<BaseResponse<any>> => {
    return ApiService.post(SERVICE.USERS, `/forgot-password`, { email });
};

export const confirmForgotPassword = (values: IForgotPassword): Promise<BaseResponse<any>> => {
    const { email, confirmationCode, newPassword } = values
    return ApiService.post(SERVICE.USERS, `/confirm-forgot-password `, { email, confirmationCode, newPassword });
};