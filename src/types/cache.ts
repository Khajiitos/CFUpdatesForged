export interface CacheData {
    [slug: string]: {
        [modLoader: string]: ModCacheData
    };
}

export interface ModCacheData {
    last_refreshed?: number;
    versions: {
        [version: string]: string;
    }
}