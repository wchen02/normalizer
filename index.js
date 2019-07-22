const fs = require('fs');
const download = require('download');
const loadJsonFile = require('load-json-file');
const mkdirp = require('mkdirp');
const uuid = require('uuid/v4');

const DOWNLOAD_DIR = 'downloads/';
const DATA_DIR = 'data/';

const getDataFile = (filename) => DATA_DIR + filename;

(async () => {
    const jsonFilePath = getDataFile('example.json');
    const data = await loadJsonFile(jsonFilePath);
    if (data.gallery.length) {
        await Promise.all(data.gallery.map(imgUrl => {
            const filename = uuid() + '.jpeg';
            const uniqueId = data.url.replace(/[:\\/]/g, '_').toLowerCase();
            mkdirp.sync(DOWNLOAD_DIR + uniqueId);
            download(imgUrl).pipe(fs.createWriteStream(DOWNLOAD_DIR + uniqueId + '/' + filename));
        }));
    }
})();
