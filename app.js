const spotify = require('./src/spotify');
const logging = require('./src/logging');
const wallpaper = require('./src/wallpaper');
const configuration = require('./src/configuration');

(async () => {
    let lastArtworkUrl = null;
    logging.log('started');

    await spotify.login();
    
    const updateWallpaper = async () => {
        try {
            const artworkUrl = await spotify.getArtwork();
            if (artworkUrl != null && artworkUrl != lastArtworkUrl) {
                const wallpaperPath = await wallpaper.create(artworkUrl);
                wallpaper.set(wallpaperPath);
            } else {
                logging.log(artworkUrl == null ? 'not listening to music right now' : 'no new artwork');
            }
            lastArtworkUrl = artworkUrl;
        } catch (e) {
            if (e.statusCode != undefined && e.statusCode == 401) { // auth token has expired
                client = await spotify.login();
                updateWallpaper();
            } else {
                logging.logError(e);
            }
        }
    };
    setInterval(updateWallpaper, configuration.interval);
    updateWallpaper();
}).call();