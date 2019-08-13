const dotenv = require('dotenv');
const normalizer = require('./index');

function main() {
    dotenv.config();
    [ LIFE_LIST_THUMBNAIL_WIDTH, LIFE_LIST_THUMBNAIL_HEIGHT ] = process.env.LIFE_LIST_THUMBNAIL_DIMENSION.split('x');
    [ LIFE_DETAIL_THUMBNAIL_WIDTH, LIFE_DETAIL_THUMBNAIL_HEIGHT ] = process.env.LIFE_DETAIL_THUMBNAIL_DIMENSION.split('x');

    const options = {
        maxConcurrency: process.env.MAX_CONCURRENCY,
        logLevel: process.env.LOG_LEVEL,
        lifeListThumbnail: {
            width: LIFE_LIST_THUMBNAIL_WIDTH,
            height: LIFE_LIST_THUMBNAIL_HEIGHT,
        },
        lifeDetailThumbnail: {
            width: LIFE_DETAIL_THUMBNAIL_WIDTH,
            height: LIFE_DETAIL_THUMBNAIL_HEIGHT,
        },
        isDevelopment: process.env.DEVELOPMENT,
        dataFile: process.env.DATA_FILE,
    }

    normalizer.run(options);
}

main();