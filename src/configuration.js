const fs = require('fs');
const path = require('path');
const config = Object.assign(getConfiguration('./config.json'), getConfiguration('./config.dev.json'));

function getPath(filename) {
    return path.join(__dirname, '../', filename);
}

function getConfiguration(filename) {
    const p = getPath(filename);

    if (!fs.existsSync(p)) return {};

    return JSON.parse(fs.readFileSync(p, 'UTF-8'));
}

module.exports = config;