const path = require('path');
const jimp = require('jimp');
const configuration = require('./configuration');
const logging = require('./logging');

module.exports = {
    create: async url => new Promise(resolve => (async () => {

        const image = await jimp.read(url);
        const width = image.getWidth();
        const height = image.getHeight();
        const ratio = width / height;

        let coverWidth = configuration.coverWidth;
        let coverHeight = configuration.coverHeight;

        if (configuration.coverFit ? width < height : width > height) {
            coverWidth = configuration.coverWidth * ratio;
        } else {
            coverHeight = configuration.coverHeight / ratio;
        }

        image.resize(coverWidth, coverHeight);

        const background = await jimp.read(url);
        let wallpaperWidth = configuration.wallpaperWidth;
        let wallpaperHeight = configuration.wallpaperHeight;

        if (width > height) {
            wallpaperHeight = configuration.wallpaperHeight * ratio;
        } else {
            wallpaperWidth = configuration.wallpaperWidth / ratio;
            wallpaperHeight = configuration.wallpaperWidth / ratio;
        }

        let wallpaperPath = configuration.output;
        if (wallpaperPath == null || wallpaperPath.length == 0) {
            wallpaperPath = path.join(__dirname, '../wallpapers', 'wallpaper.jpg');
        }
        
        background
            .resize(wallpaperWidth, wallpaperHeight)
            .crop((wallpaperWidth - configuration.wallpaperWidth) / 2, (wallpaperHeight - configuration.wallpaperHeight) / 2, configuration.wallpaperWidth, configuration.wallpaperHeight)
            .blur(configuration.blur)
            .composite(image, (configuration.wallpaperWidth - coverWidth) / 2, (configuration.wallpaperHeight - coverHeight) / 2)
            .write(wallpaperPath);

            
        logging.log(`wallpaper created from ${url}`);
        resolve(wallpaperPath);
    }).call()),
    set: path => {
        const wallpaper = require('wallpaper');
        wallpaper.set(path);
        logging.log('wallpaper updated');
    }
}