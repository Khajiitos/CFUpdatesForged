export interface CFUFConfig {
    port: number;
    mods: {
        [slug: string]: ModDescription
    };
    max_files: number;
    cache_for_seconds: number;
    remove_alphas: boolean;
}

export interface ModDescription {
    homepage: string;
    project_id: number;
}