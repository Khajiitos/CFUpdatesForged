import { ModLoader } from "../types/cf_api";
import { toResponseJson, updateCacheIfNecessary } from "../update_cache";

const express = require('express');
const router = express.Router();

async function handleGetUpdates(modLoader: ModLoader, req, res, next) {
    const slug = req.params.slug;

    if (!slug) {
        next();
        return;
    }

    const cacheUpdateResult = await updateCacheIfNecessary(slug, modLoader);

    if (cacheUpdateResult === null) {
        next();
        return;
    }

    const responseJson = toResponseJson(slug, modLoader);

    if (responseJson === null) {
        next();
        return;
    }

    res.json(responseJson);
}

router.get("/:slug/updates-forge.json", (req, res, next) => handleGetUpdates(ModLoader.FORGE, req, res, next));
router.get("/:slug/updates-neoforge.json", (req, res, next) => handleGetUpdates(ModLoader.NEOFORGE, req, res, next));

export default router;