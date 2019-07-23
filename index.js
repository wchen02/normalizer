const fs = require('fs');
const fileType = require('file-type');
const log = require('loglevel');
const { promisify } = require('util')
const download = require('download');
const loadJsonFile = require('load-json-file');
const mkdirp = require('mkdirp');
const uuid = require('uuid/v4');

const DOWNLOAD_DIR = 'downloads/';
const DATA_DIR = 'data/';

const getDataFile = (filename) => DATA_DIR + filename;

async function downloadDataFileGallery(dataFilename) {
    log.info(`Opening ${dataFilename}`)
    const jsonFilePath = getDataFile(dataFilename);
    const data = await loadJsonFile(jsonFilePath);
    log.info(JSON.stringify(data));

    if (data.gallery.length) {
        log.info(`Found ${data.gallery.length} gallery images`);
        await Promise.all(data.gallery.map(async (imgUrl) => {
            // mkdir with ':' and '/' chars replaced to '_'
            const galleryPath = DOWNLOAD_DIR + data.url.replace(/[:\\/]/g, '_').toLowerCase();
            log.info(`Making directory ${galleryPath}`);
            mkdirp.sync(galleryPath);
            
            log.info(`Download image ${imgUrl}`);
            const fileData = await download(imgUrl);
            const fileDataType = fileType(fileData);

            if (!fileDataType) {
                log.warn('Invalid filetype, skipping.');
                return;
            }

            if (fileDataType.mime.includes('image/')) {
                const writeFileAsync = promisify(fs.writeFile);
                const filename = galleryPath + '/' + uuid() + '.' + fileDataType.ext;
                writeFileAsync(filename, fileData);
                log.log(`Downloaded to ${filename}`);
            }
        }));
    }
}

async function main() {
    log.setLevel(process.env.LOG_LEVEL);
    const readdirAsync = promisify(fs.readdir)

    let files;

    try {
        log.info(`Scaning data directory ${DATA_DIR}`);
        files = await readdirAsync(DATA_DIR);
        log.info(`Found ${files.length} data files.`);
    } catch (err) {
        return log.error('Unable to scan directory: ' + err);
    }

    await Promise.all(files.map(file => downloadDataFileGallery(file)));
}

main();
