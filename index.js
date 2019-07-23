const fs = require('fs');
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
        await Promise.all(data.gallery.map(imgUrl => {
            const filename = uuid() + '.jpeg';
            const uniqueId = data.url.replace(/[:\\/]/g, '_').toLowerCase();
            mkdirp.sync(DOWNLOAD_DIR + uniqueId);
            download(imgUrl).pipe(fs.createWriteStream(DOWNLOAD_DIR + uniqueId + '/' + filename));
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

    files.forEach(async (file) => {
        await downloadDataFileGallery(file);
    });
}

main();