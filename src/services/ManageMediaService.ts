import { BuildingsFiltersOptions, BuildingsResponse, MediaCoverage, MediaFilters } from "@/models/BuildingMediaModel";
import { ApiService } from "./BaseService";
import { BaseResponse, SERVICE } from "@/models/BaseModel";

export const uploadBuildingMedia = (values: any): Promise<BaseResponse<void>> => {
    return ApiService.post(SERVICE.BUILDINGS, "/buildings/upload-building-media", values);
};

export const getBuildings = (page: number, limit: number, filters?: MediaFilters, userId?: string): Promise<BaseResponse<BuildingsResponse>> => {
    let queryString = `/buildings/buildings?page=${page}&limit=${limit}`;
    if (userId) {
        queryString += `&userId=${userId}`;
    }
    queryString += "&filters={";
    if (filters?.state !== undefined) {
        queryString += `"state":"${filters?.state}",`;
    }
    if (filters?.metro !== undefined) {
        queryString += `"metro":"${filters?.metro}",`;
    }
    if (filters?.county !== undefined) {
        queryString += `"county":"${filters?.county}",`;
    }
    if (filters?.city !== undefined) {
        queryString += `"city":"${filters?.city}",`;
    }
    if (filters?.zip !== undefined) {
        queryString += `"zip":"${filters?.zip}",`;
    }
    if (filters?.neighbourhood !== undefined) {
        queryString += `"neighbourhood":"${filters?.neighbourhood}",`;
    }
    if (filters?.name !== undefined) {
        queryString += `"name":"${filters?.name}"`;
    }
    if (queryString.endsWith(",")) {
        queryString = queryString.slice(0, -1);
    }
    queryString += "}";
    return ApiService.get(SERVICE.BUILDINGS, queryString);
};

export const getMediaCoverage = (filters?: MediaFilters): Promise<BaseResponse<MediaCoverage>> => {
    let queryString = `/buildings/media-coverage?`;

    queryString += "filters={";
    if (filters?.state !== undefined) {
        queryString += `"state":"${filters?.state}",`;
    }
    if (filters?.metro !== undefined) {
        queryString += `"metro":"${filters?.metro}",`;
    }
    if (filters?.county !== undefined) {
        queryString += `"county":"${filters?.county}",`;
    }
    if (filters?.city !== undefined) {
        queryString += `"city":"${filters?.city}",`;
    }
    if (filters?.zip !== undefined) {
        queryString += `"zip":"${filters?.zip}",`;
    }
    if (filters?.neighbourhood !== undefined) {
        queryString += `"neighbourhood":"${filters?.neighbourhood}",`;
    }
    if (filters?.name !== undefined) {
        queryString += `"name":"${filters?.name}"`;
    }
    // Remove the trailing comma if it exists
    if (queryString.endsWith(",")) {
        queryString = queryString.slice(0, -1);
    }
    queryString += "}";
    return ApiService.get(SERVICE.BUILDINGS, queryString);
};


export const getBuildingsFiltersOptions = (filters?: MediaFilters): Promise<BaseResponse<BuildingsFiltersOptions>> => {
    let queryString = `/buildings/building-dropdown-values?`;

    queryString += "filters={";
    if (filters?.state !== undefined) {
        queryString += `"state":"${filters?.state}",`;
    }
    if (filters?.metro !== undefined) {
        queryString += `"metro":"${filters?.metro}",`;
    }
    if (filters?.county !== undefined) {
        queryString += `"county":"${filters?.county}",`;
    }
    if (filters?.city !== undefined) {
        queryString += `"city":"${filters?.city}",`;
    }
    if (filters?.zip !== undefined) {
        queryString += `"zip":"${filters?.zip}",`;
    }

    if (filters?.neighbourhood !== undefined) {
        queryString += `"neighbourhood":"${filters?.neighbourhood}",`;
    }
    if (filters?.name !== undefined) {
        queryString += `"name":"${filters?.name}"`;
    }
    if (queryString.endsWith(",")) {
        queryString = queryString.slice(0, -1);
    }
    queryString += "}";
    return ApiService.get(SERVICE.BUILDINGS, queryString);
};


