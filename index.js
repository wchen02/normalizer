const { findNumbers } = require('libphonenumber-js');
const fs = require('fs');
const fileType = require('file-type');
const log = require('loglevel');
const { promisify } = require('util');
const download = require('download');
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');
const uuid = require('uuid/v4');
const { format, getTime } = require('date-fns');
const async = require('async');
const thumb = require('node-thumbnail').thumb;

async function openFile(filename) {
    log.info(`Opening ${ filename }`)
    let dataJson;
    try {
        dataJson = await jsonfile.readFile(filename);
    } catch (err) {
        log.error(`Error opening file: "${ filename }"`);
        log.error(err);
    }
    log.debug(dataJson);
    return dataJson;
}

async function writeFile(filename, dataJson) {
    log.info(`Writing Transformed Data JSON to ${ filename }`)
    log.debug(dataJson);
    try {
        dataJson = await jsonfile.writeFile(filename, dataJson, { spaces: 2 });
    } catch (err) {
        log.error(`Error writing to file: "${ filename }"`);
        log.error(err);
    }
    log.debug('Done');
    return dataJson;
}

async function downloadImage(dataJson, imgUrl, options) {
    if (!imgUrl) {
        return;
    }

    const date = new Date(dataJson.date);
    const year = format(date, 'YYYY');
    const month = format(date, 'MM');
    const day = format(date, 'DD');

    const attachsDir = options.dir.download + '/' + year + '/' + month + '/' + day + '/';
    makeDirectories(attachsDir);
    
    log.info(`Download image ${ imgUrl }`);
    let fileData;
    try {
        fileData = await download(imgUrl);
    } catch (err) {
        log.error(`Error downloading image ${ imgUrl }`);
        log.error(err);
    }

    const fileDataType = fileType(fileData);
    if (!fileDataType || !fileDataType.mime.includes('image/')) {
        log.warn('Invalid filetype, skipping.');
        return;
    }

    const writeFileAsync = promisify(fs.writeFile);
    const strippedUuid = uuid().replace(/-/g, '');
    const filename = attachsDir + strippedUuid + '.' + fileDataType.ext;
    try {
        await writeFileAsync(filename, fileData);
    } catch (err) {
        log.error(`Error writing file ${ filename }`);
        log.error(err);
    }
    log.debug(`Downloaded to ${ filename }`);

    return filename;
}

async function generateThumbnailImage(imgFilename, width, height) {
    if (!imgFilename) {
        return;
    }

    const indexOfLastDir = imgFilename.lastIndexOf('/') + 1;
    const imageFileDir = imgFilename.substring(0, indexOfLastDir);
    const imgName = imgFilename.substring(indexOfLastDir);
    const thumbnailFilename = imageFileDir + 'thumb_' + imgName;

    log.info(`Generating ${ width }x${ height } thumbnail from ${ imgFilename }`);
    try {
        await thumb({
            source: imgFilename,
            prefix: 'thumb_',
            suffix: '',
            destination: imageFileDir,
            width,
            logger: function(message) {
                log.debug(message);
            }
        });
    } catch(err) {
        log.error(`Error generating thumbnail from ${ imgFilename }`);
        log.error(err);        
    }
    log.debug(`Generated thumbnail ${ thumbnailFilename }`);

    return thumbnailFilename;
}

async function downloadThumbnailImage(dataJson, transformedDataJson, options) {
    let thumbnailFilename;

    if (dataJson.photo) {
        const imgFilename = await downloadImage(dataJson, dataJson.photo, options);
        thumbnailFilename = await generateThumbnailImage(imgFilename, options.lifeListThumbnail.width, options.lifeListThumbnail.height);
    } else if (transformedDataJson.gallery.length) {
        thumbnailFilename = transformedDataJson.gallery[0];
    }
    transformedDataJson.photo = thumbnailFilename;
}

async function downloadGalleryImages(dataJson, transformedDataJson, options) {
    if (!dataJson.gallery.length) {
        return;
    }

    log.info(`Found ${ dataJson.gallery.length } gallery images`);
    const newGalleryPaths = await Promise.all(dataJson.gallery.map(async (imgUrl) => {
        return downloadImage(dataJson, imgUrl, options);
    }));
    log.debug('Gallery images: ');
    log.debug(newGalleryPaths);

    const newGalleryThumbnailPaths = await Promise.all(newGalleryPaths.map(async (imgFilename) => {
        return generateThumbnailImage(imgFilename, options.lifeDetailThumbnail.width, options.lifeDetailThumbnail.height);
    }));

    transformedDataJson.gallery = newGalleryThumbnailPaths;
}

async function parsePhoneNumber(dataJson, transformedDataJson) {
    if (!dataJson.contact_phone) {
        log.info('Parsing phone number');
        const phoneNumber = findNumbers(dataJson.details, 'US', { v2: true });
        if (phoneNumber.length) {
            log.debug(`Found ${ phoneNumber[0].number.nationalNumber }`);
            transformedDataJson.contact_phone = phoneNumber[0].number.nationalNumber;
        }
    }
}

function mapCategoryToId(dataJson, transformedDataJson) {
    const categoryIdMap = {
        '纽约皇后区·房屋出租': 47,
        '纽约·艾姆赫斯特·房屋出租(Elmhurst & Corona)': 47,
        '纽约·艾姆赫斯特·房屋出租(Elmhurst & Corona)': 47,
        '法拉盛租房 FlushingA邮编11355，11354。非中介无佣金出租': 47,
        '租房(布碌仑)': 47,
        '租房(曼哈顿)': 47,
        '长岛·新泽西·其它区': 47,
        '房屋买卖': 49,
        '商铺租让，办公楼租让，生意租让': 51,
        '商铺租让，办公楼租让，生意租让': 51,
        '顺风车(Car Pool)': 46,
        '家庭旅馆•床位出租•机票•旅行社•纽约华人旅店': 104,
        '大小搬家·纽约搬家公司·法拉盛搬家公司': 108,
        '电召车·机场接送·购物旅游·旅游包车·旅游租车·巴士': 103,
        '纽约社区信息 纽约社区活动 纽约周末活动': 44,
        '教会·宗教': 44,
        '其它': 147,
        '大地问答': 44,
        '房东房客': 47,
        '大地聊天室': 44,
        '好玩網頁遊戲·娱乐': 44,
        '招聘·请员工': 89,
        '甲店·美容Spa·发廊·纹身店请人': 83,
        '餐馆请人·KTV请人·奶茶店请人·水吧·酒吧请人': 74,
        '推拿按摩请人·请前台·请司机': 69,
        '求职': 38,
        '销售·兼职·代购招聘·合作伙伴': 68,
        '网络公司招聘·网络电商兼职': 84,
        '二手买卖': 19,
        '手机买卖·手机维修': 1,
        '汽车买卖': 21,
        '电脑买卖': 14,
        '货品买卖': 19,
        '交友·征婚': 42,
        '生活服务·摄影服务·护照像': 129,
        '装修服务': 95,
        '冷暖水电': 95,
        '防盗报警·警钟·远程近程监控': 129,
        '验屋服务': 129,
        '纽约中餐馆·小吃--华埠，中城': 125,
        '纽约中餐馆·小吃--皇后区，法拉盛': 125,
        '纽约中餐馆·小吃 -- 布碌仑 (Brooklyn)': 125,
        '各类律师': 122,
        '会计•报税': 97,
        '各类保险': 129,
        '贷款·财务·投资·信用卡': 91,
        '入籍•福利': 122,
        '留学•转学•签证•移民': 122,
        '翻译服务·各类公证·认证·委托': 126,
        '电脑·网络·硬件·附件': 98,
        '网页设计·软件开发': 118,
        '印刷•招牌': 112,
        '职业技术培训·才艺学校·英语课程·中文教学': 59,
        '各科补习·补习班·SAT·ACT·升学补习': 58,
        '幼儿园·家庭托儿': 65,
        '美容•发廊•Spa': 116,
        '推拿·按摩·理疗·痛症治疗': 116,
        '各科医生·理疗·保健': 128,
        '考牌练车': 109,
        '快递•货运': 99,
        '免费广告(加拿大)': 147,
    };

    if (dataJson.category && categoryIdMap[dataJson.category]) {
        transformedDataJson.cate_id = categoryIdMap[dataJson.category];
    } else {
        transformedDataJson.cate_id = 147
    }

    log.info(`Mapped category ${ dataJson.category } to ${ transformedDataJson.cate_id }`);
    delete transformedDataJson.category;
}

function mapCityToId(dataJson, transformedDataJson) {
    const cityIdMap = {
        'New York': 1
    }
    if (dataJson.city && cityIdMap[dataJson.city]) {
        transformedDataJson.city_id = cityIdMap[dataJson.city];
    } else {
        transformedDataJson.city_id = 1;
    }

    log.info(`Mapped city ${ dataJson.city } to ${ transformedDataJson.city_id }`);
    delete transformedDataJson.city;
}

function mapAreaToId(dataJson, transformedDataJson) {
    const areaIdMap = {
        'Queens': 1,
        'Flushing': 5,
        'Elmhurst': 6,
        'Brooklyn': 7,
        'Manhattan': 8,
        'Bronx': 9,
        'Staten Island': 10,
        'Other': 11,
        'Long Island': 12,
    }
    if (dataJson.area && areaIdMap[dataJson.area]) {
        transformedDataJson.area_id = areaIdMap[dataJson.area];
    } else {
        transformedDataJson.area_id = 1;
    }

    log.info(`Mapped area ${ dataJson.area } to ${ transformedDataJson.area_id }`);
    delete transformedDataJson.area;
}

function mapSubareaToBusinessId(dataJson, transformedDataJson) {
    const subareaToBusinessIdMap = {
        'Flushing': 1
    }
    if (dataJson.subarea && subareaToBusinessIdMap[dataJson.subarea]) {
        transformedDataJson.business_id = subareaToBusinessIdMap[dataJson.subarea];
    } else {
        transformedDataJson.business_id = 1;
    }

    log.info(`Mapped subarea ${ dataJson.subarea } to ${ transformedDataJson.business_id }`);
    delete transformedDataJson.subarea;
}

function convertDateToUnixTimestamp(dataJson, transformedDataJson) {
    if (!dataJson.date) {
        return;
    }
    const date = new Date(dataJson.date);
    const unixTimestamp = getTime(date)/1000;

    transformedDataJson.create_time = unixTimestamp;
    transformedDataJson.last_time = unixTimestamp;    
    log.info(`Converted ${ dataJson.date } to ${ unixTimestamp }`);

    delete transformedDataJson.date;
}

function addMissingDefaultFields(dataJson, transformedDataJson) {
    const date = dataJson.date ? new Date(dataJson.date) : new Date();
    const formattedDate = format(date, 'YYYY-MM-DD');

    if (!dataJson.urgent_date) {
        transformedDataJson.urgent_date = formattedDate;
    }
    if (!dataJson.top_date) {
        transformedDataJson.top_date = formattedDate;
    }
    if (!dataJson.text1) {
        transformedDataJson.text1 = null;
    }
    if (!dataJson.text2) {
        transformedDataJson.text2 = null;
    }
    if (!dataJson.text3) {
        transformedDataJson.text3 = null;
    }
    if (!dataJson.num1) {
        transformedDataJson.num1 = null;
    }
    if (!dataJson.num2) {
        transformedDataJson.num2 = null;
    }
    if (!dataJson.select1) {
        transformedDataJson.select1 = null;
    }
    if (!dataJson.select2) {
        transformedDataJson.select2 = null;
    }
    if (!dataJson.select3) {
        transformedDataJson.select3 = null;
    }
    if (!dataJson.select4) {
        transformedDataJson.select4 = null;
    }
    if (!dataJson.select5) {
        transformedDataJson.select5 = null;
    }
    if (!dataJson.audit) {
        transformedDataJson.audit = 1;
    }
    if (!dataJson.user_id) {
        transformedDataJson.user_id = 2;
    }
}

function getUniqueKey(dataJson) {
    return dataJson.url.toLowerCase().replace(/\W/g, '_');
}

async function processDataJson(dataJson, options) {
    try {
        // copied a new object out of dataJson
        const transformedDataJson = JSON.parse(JSON.stringify(dataJson));

        await Promise.all([
            downloadGalleryImages(dataJson, transformedDataJson, options),
            parsePhoneNumber(dataJson, transformedDataJson),
            mapCategoryToId(dataJson, transformedDataJson),
            mapCityToId(dataJson, transformedDataJson),
            mapAreaToId(dataJson, transformedDataJson),
            mapSubareaToBusinessId(dataJson, transformedDataJson),
            addMissingDefaultFields(dataJson, transformedDataJson),
        ]);
        await downloadThumbnailImage(dataJson, transformedDataJson, options);
        await convertDateToUnixTimestamp(dataJson, transformedDataJson);

        const uniqueKey = await getUniqueKey(dataJson);
        await writeFile(options.dir.normalizedData + '/' + uniqueKey + '.json', transformedDataJson);
    } catch (err) {
        log.error('Error processing dataJson');
        log.error(dataJson);
        log.error(err);
    }

}
async function processFile(filename, options) {
    try {
        const dataJson = await openFile(options.dir.rawData + '/' + filename);
        if (Array.isArray(dataJson)) {            
            await async.mapLimit(dataJson, options.maxConcurrency, async (json) => {
                await processDataJson(json, options);
            });
        } else {
            await processDataJson(dataJson, options);
        }
    } catch (err) {
        log.error(`Error processing file ${ filename }`);
        log.error(err);
    }
}

function makeDirectories(dir) {
    log.info(`Making directory ${ dir }`);
    try {
        mkdirp.sync(dir);
    } catch (err) {
        log.error(`Error to make dir ${ dir }`);
        log.error(err);
    }

    return dir;
}

async function run(options) {
    const { 
        logLevel, 
        isDevelopment,
        dataFile,
        dir,
    } = options;

    log.setLevel(logLevel);

    makeDirectories(dir.download);
    makeDirectories(dir.normalizedData);
    
    if (isDevelopment) {
        await processFile(dataFile, options);
    } else {
        const readdirAsync = promisify(fs.readdir)

        let files;
    
        try {
            log.info(`Scanning data directory ${ dir.rawData }`);
            files = await readdirAsync(dir.rawData);
            log.info(`Found ${ files.length } data files.`);
        } catch (err) {
            log.error(`Error scanning directory ${ dir.rawData }`);
            log.error(err);
            return;
        }

        await Promise.all(files.map(filename => {
            processFile(filename, options);
        }));
    }
}

function getOptions(options) {
    return {
        maxConcurrency: options.MAX_CONCURRENCY,
        logLevel: options.LOG_LEVEL,
        lifeListThumbnail: {
            width: options.LIFE_LIST_THUMBNAIL_WIDTH,
            height: options.LIFE_LIST_THUMBNAIL_HEIGHT,
        },
        lifeDetailThumbnail: {
            width: options.LIFE_DETAIL_THUMBNAIL_WIDTH,
            height: options.LIFE_DETAIL_THUMBNAIL_HEIGHT,
        },
        isDevelopment: options.DEVELOPMENT,
        dataFile: options.DATA_FILE,
        dir: {
            download: options.DOWNLOAD_DIR,
            rawData: options.RAW_DATA_DIR,
            normalizedData: options.NORMALIZED_DATA_DIR,
        }
    }
}

module.exports = {
    run,
    getOptions,
};
