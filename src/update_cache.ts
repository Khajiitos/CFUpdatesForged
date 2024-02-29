import { CacheData } from "./types/cache";
import config from './config';
import { ModDescription } from "./types";
import { APIFilesResponse, ModLoader } from "./types/cf_api";

const cache: CacheData = {}

export async function updateCacheIfNecessary(modSlug: string, modLoader: ModLoader): Promise<boolean|null> {
    const modDescription: ModDescription|undefined = config.mods[modSlug];

    if (!modDescription) {
        return null;
    }

    if (cache[modSlug] && cache[modSlug][modLoader] && cache[modSlug][modLoader].last_refreshed) {
        if (Date.now() - cache[modSlug][modLoader].last_refreshed < config.cache_for_seconds * 1000) {
            return false;
        }
    }

    const url = `https://www.curseforge.com/api/v1/mods/${modDescription.project_id}/files?pageIndex=0&pageSize=${config.max_files}&sort=dateCreated&sortDescending=true&removeAlphas=${config.remove_alphas}`;

    const res = await fetch(url, { 
        headers: {
            'user-agent': "CFUpdatesForged/" + process.env.npm_package_version
        }
    });

    const json: APIFilesResponse = await res.json();

    const versions = {};

    for (const fileInfo of json.data) {
        const modVersion = fileNameToModVersion(fileInfo.displayName);

        if (!modVersion) {
            continue;
        }

        // We only want to look at versions for our mod loader
        if (!fileInfo.gameVersions.some(version => version === modLoader)) {
            continue;
        }

        const mcVersions = getOnlyMinecraftVersions(fileInfo.gameVersions);
        
        for (const mcVersion of mcVersions) {
            for (const type of ["latest", "recommended"]) {
                const finalVersion = mcVersion + "-" + type;
                if (typeof versions[finalVersion] === 'undefined') {
                    versions[finalVersion] = modVersion;
                }
            }
        }

        if (!cache[modSlug]) {
            cache[modSlug] = {};
        }

        cache[modSlug][modLoader] = {
            versions,
            last_refreshed: Date.now()
        };
    }

    return true;
}

function getOnlyMinecraftVersions(allVersions: string[]): string[] {
    return allVersions.filter(version => {
        const regex = /^\d+\.\d+\.\d+$/;
        const match = version.match(regex);

        return !!match;
    });
}

function fileNameToModVersion(fileName: string): string|null {
    const regex = /[^\d]\b\d+\.\d+\.\d+\b/;
    const match = fileName.match(regex);

    if (match) {
        return match[0].substring(1);
    } else {
        return null;
    }
}

export function toResponseJson(modSlug: string, modLoader: ModLoader): object|null {
    const modDescription: ModDescription|undefined = config.mods[modSlug];

    if (!modDescription) {
        return null;
    }

    if (!cache[modSlug]) {
        return null;
    }

    if (!cache[modSlug][modLoader]) {
        return null;
    }

    return {
        promos: cache[modSlug][modLoader].versions || {},
        homepage: modDescription.homepage
    }
}