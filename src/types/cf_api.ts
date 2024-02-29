export interface FileInfo {
    id: number;
    dateCreated: string;
    dateModified: string;
    displayName: string;
    fileLength: number;
    fileName: string;
    status: number;
    gameVersions: string[];
    gameVersionTypeIds: number[];
    releaseType: number;
    totalDownloads: number;
    user: UserInformation;
    additionalFilesCount: number;
    hasServerPack: boolean;
    additionalServerPackFilesCount: number;
    isEarlyAccessContent: boolean;
    isCompatibleWithClient: boolean;
}

export interface UserInformation {
    username: string;
    id: number;
    twitchAvatarUrl: string;
    displayName: string;
}

export interface APIFilesResponse {
    data: FileInfo[];
    pagination: {
        index: number;
        pageSize: number;
        totalCount: number;
    }
}

export enum ModLoader {
    FORGE = 'Forge',
    NEOFORGE = 'NeoForge'
}