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
const RAW_DATA_DIR = DATA_DIR + 'raw/';
const NORMALIZED_DATA_DIR = DATA_DIR + 'normalized/';

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

async function writeFile(filename, dataJson) {
    log.info(`Writing to ${filename}`)
    log.info(`Transformed Data JSON:\n ${JSON.stringify(dataJson)}`);
    try {
        dataJson = await jsonfile.writeFile(filename, dataJson, { spaces: 2 });
    } catch (err) {
        log.error(`Error writting to file: "${filename}"`);
        log.error(err);
    }
    log.info('Done');
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

function mapCategoryToId(dataJson, transformedDataJson) {
    const categoryIdMap = {
        '租房(皇后区)': 47,
        '租房(艾姆赫斯特Elmhurst)': 47,
        '租房(可乐娜Corona)': 47,
        '租房(法拉盛Flushing中心区)': 47,
        '租房(布碌仑)': 47,
        '租房(曼哈顿)': 47,
        '租房(长岛·新泽西·其它区)': 47,
        '房屋买卖': 49,
        '商铺·办公楼': 51,
        '生意租让': 51,
        '顺风车(Car Pool)': 46,
        '家庭旅馆•机票•旅行社': 104,
        '大小搬家': 108,
        '电召车·机场接送': 103,
        '社区信息': 44,
        '教会·宗教': 44,
        '其它': 147,
        '大地问答': 44,
        '房东房客': 47,
        '纽约聊天室 进来聊聊': 44,
        '好玩網頁遊戲': 44,
        '招聘请人': 89,
        '美容发廊请人': 83,
        '甲店请人': 83,
        '餐馆请人': 74,
        '推拿按摩请人': 69,
        '求职': 38,
        '销售·兼职·代购招聘': 68,
        '网络公司招聘': 84,
        '二手买卖': 19,
        '手机买卖': 1,
        '汽车买卖': 21,
        '电脑买卖': 14,
        '货品买卖': 19,
        '交友·征婚': 42,
        '生活服务': 129,
        '装修服务': 95,
        '冷暖水电': 95,
        '防盗报警': 129,
        '验屋服务': 129,
        '纽约中餐馆-华埠,中城': 125,
        '纽约中餐馆-皇后区': 125,
        '纽约中餐馆-布碌仑': 125,
        '各类律师': 122,
        '会计·报税': 97,
        '各类保险': 129,
        '贷款·财务·投资': 91,
        '入籍·福利': 122,
        '留学•签证': 122,
        '翻译服务': 126,
        '电脑·网络': 98,
        '网页设计': 118,
        '印刷·招牌': 112,
        '职业技术·才艺·英语班': 59,
        '补习·课后班·升学补习': 58,
        '幼儿园·托儿': 65,
        '美容·Spa': 116,
        '推拿·按摩': 116,
        '各科医生·理疗·保健': 128,
        '考牌练车': 109,
        '快递·货运': 99,
        '免费广告(加拿大)': 147,
    };

    if (dataJson.category && categoryIdMap[dataJson.category]) {
        transformedDataJson.cate_id = categoryIdMap[dataJson.category];
    } else {
        transformedDataJson.cate_id = 147
    }
    delete transformedDataJson.category;
}

async function processFile(filename) {
    const dataJson = await openFile(RAW_DATA_DIR + filename);
    // copied a new object out of dataJson
    const transformedDataJson = JSON.parse(JSON.stringify(dataJson));
    await Promise.all([
        downloadDataFileGallery(dataJson, transformedDataJson),
        parsePhoneNumber(dataJson, transformedDataJson),
        mapCategoryToId(dataJson, transformedDataJson),
    ]);

    await writeFile(NORMALIZED_DATA_DIR + filename, transformedDataJson);
}

async function main() {
    log.setLevel(process.env.LOG_LEVEL);

    if (process.env.DEVELOPMENT) {
        processFile('example.json');
    } else {
        const readdirAsync = promisify(fs.readdir)

        let files;
    
        try {
            log.info(`Scaning data directory ${RAW_DATA_DIR}`);
            files = await readdirAsync(RAW_DATA_DIR);
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
