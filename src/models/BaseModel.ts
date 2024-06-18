export interface BaseResponse<T> {
    message: string;
    data: T;
    status: "success" | "failed"
}

export enum SERVICE {
    USERS = "users",
    BUILDINGS = "buildings",
    AMENITIES = "amenities",
    POLICIES = "policies",
}