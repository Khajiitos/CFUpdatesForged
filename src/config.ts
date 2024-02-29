import { CFUFConfig } from "./types";
import fs = require('fs');

const defaultConfig: CFUFConfig = {
    port: 8080,
    mods: {
        "cat-loaf": {
            homepage: "https://www.curseforge.com/minecraft/mc-mods/cat-loaf",
            project_id: 978666
        }
    },
    max_files: 100,
    cache_for_seconds: 3600,
    remove_alphas: false
};

let config = Object.assign({}, defaultConfig);

if (!fs.existsSync('config.json')) {
    console.log('config.json doesn\'t exist, creating it');
    fs.writeFileSync('config.json', JSON.stringify(defaultConfig, undefined, 2));
} else {
    try {
        config = JSON.parse(fs.readFileSync('config.json').toString());
    } catch(e) {
        console.log('config.json isn\'t valid JSON!');
        console.error(e);
        process.exit(1);
    }
}

let rewriteConfig = false;
for (let field of Object.keys(config)) {
    if (typeof config[field] === 'undefined') {
        config[field] = defaultConfig[field];
        rewriteConfig = true;
    }
}

if (rewriteConfig) {
    fs.writeFileSync('config.json', JSON.stringify(config, undefined, 2));
}

export default config;