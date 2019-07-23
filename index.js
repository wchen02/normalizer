const fs = require('fs');
const fileType = require('file-type');
const stream = require('stream');

const { promisify } = require('util')
const download = require('download');
const loadJsonFile = require('load-json-file');
const mkdirp = require('mkdirp');
const uuid = require('uuid/v4');

const DOWNLOAD_DIR = 'downloads/';
const DATA_DIR = 'data/';

const getDataFile = (filename) => DATA_DIR + filename;

async function downloadDataFileGallery(dataFilename) {
    const jsonFilePath = getDataFile(dataFilename);
    const data = await loadJsonFile(jsonFilePath);

    if (data.gallery.length) {
        await Promise.all(data.gallery.map(async (imgUrl) => {
            // mkdir with ':' and '/' chars replaced to '_'
            const galleryPath = DOWNLOAD_DIR + data.url.replace(/[:\\/]/g, '_').toLowerCase();
            mkdirp.sync(galleryPath);
            
            const fileData = await download(imgUrl);
            const fileDataType = fileType(fileData);

            if (!fileDataType) {
                console.warn('Invalid filetype, skipping.');
                return;
            }

            if (fileDataType.mime.includes('image/')) {
                const writeFileAsync = promisify(fs.writeFile);
                const filename = uuid() + '.' + fileDataType.ext;
                writeFileAsync(galleryPath + '/' + filename, fileData);
                console.log(`Downloaded ${filename}`);
            }
        }));
    }
}

async function main() {
    const readdirAsync = promisify(fs.readdir)

    let files;

    try {
        files = await readdirAsync(DATA_DIR);
    } catch (err) {
        return console.error('Unable to scan directory: ' + err);
    }

    await Promise.all(files.map(file => downloadDataFileGallery(file)));
}

main();
