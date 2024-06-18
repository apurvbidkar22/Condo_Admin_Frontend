export interface BuildingMedia {
    id: number
    name?: string
    city?: string
    state?: string
    neighbourhood: string
    zip?: string
    volume?: number
    county?: string
    virtualTourUrl: string
    images?: IFile[]
    imagesCount?: number
    videos?: IFile[]
    videosCount?: number
    metro?: string
    actions?: string
}

export interface MediaFilters {
    name?: string
    city?: string
    state?: string
    neighbourhood?: string
    zip?: string
    metro?: string
    county?: string
}

export interface IFile {
    id?: string;
    name?: string;
    seqNo?: number;
    imageUrl?: string | null
    thumbUrl: string
    videoUrl?: string | null
}

export interface BuildingsFiltersOptions {
    name?: string[]
    city?: string[]
    state?: string[]
    neighbourhood?: string[]
    zip?: string[]
    metro?: string[]
    county?: string[]
    buildingname?: string[]
}

export interface MediaCoverage {
    imagesCount: number;
    videosCount: number;
    linksCount: number;
    totalMediaCount: number;
    remainingMediaCount: number;
}

export interface BuildingsResponse {
    count: number
    rows: BuildingMedia[]
}

export interface BuildingsFiltesResponse {
    data: BuildingsFiltersOptions
    message?: string
}