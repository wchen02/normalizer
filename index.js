const { findNumbers } = require('libphonenumber-js');
const fs = require('fs');
const fileType = require('file-type');
const log = require('loglevel');
const { promisify } = require('util')
const download = require('download');
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');
const uuid = require('uuid/v4');

const DOWNLOAD_DIR = 'downloads/';
const DATA_DIR = 'data/';

async function openFile(filename) {
    log.info(`Opening ${filename}`)
    let dataJson;
    try {
        dataJson = await jsonfile.readFile(filename);
    } catch (err) {
        log.error(`Error opening file: "${filename}"`);
        log.error(err);
    }
    log.info(JSON.stringify(dataJson));
    return dataJson;
}

async function downloadDataFileGallery(dataJson, transformedDataJson) {
    if (!dataJson.gallery.length) {
        return;
    }

    log.info(`Found ${dataJson.gallery.length} gallery images`);
    const newGalleryPaths = [];
    await Promise.all(dataJson.gallery.map(async (imgUrl) => {
        // mkdir with ':' and '/' chars replaced to '_'
        const galleryPath = DOWNLOAD_DIR + dataJson.url.replace(/[:\\/]/g, '_').toLowerCase();
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
            newGalleryPaths.push(filename);
            log.log(`Downloaded to ${filename}`);
        }
    }));

    transformedDataJson.gallery = newGalleryPaths;
}

async function parsePhoneNumber(dataJson, transformedDataJson) {
    if (!dataJson.contact_phone) {
        log.info('Parseing phone number');
        const phoneNumber = findNumbers(dataJson.details, 'US', { v2: true });
        if (phoneNumber.length) {
            log.info(`Found ${phoneNumber[0].number.nationalNumber}`);
            transformedDataJson.contact_phone = phoneNumber[0].number.nationalNumber;
        }
    }
}

async function processFile(filename) {
    const dataJson = await openFile(DATA_DIR + filename);
    // copied a new object out of dataJson
    const transformedDataJson = JSON.parse(JSON.stringify(dataJson));
    await Promise.all([
        downloadDataFileGallery(dataJson, transformedDataJson),
        parsePhoneNumber(dataJson, transformedDataJson)
    ]);

    log.info(`Transformed Data JSON:\n ${JSON.stringify(transformedDataJson)}`);
    // await writeFile(DATA_DIR + filename, transformedDataJson);
}

async function main() {
    log.setLevel(process.env.LOG_LEVEL);

    if (process.env.DEVELOPMENT) {
        processFile('example.json');
    } else {
        const readdirAsync = promisify(fs.readdir)

        let files;
    
        try {
            log.info(`Scaning data directory ${DATA_DIR}`);
            files = await readdirAsync(DATA_DIR);
            log.info(`Found ${files.length} data files.`);
        } catch (err) {
            return log.error('Unable to scan directory: ' + err);
        }

        await Promise.all(files.map(filename => {
            processFile(filename);
        }));
    }
}

main();
