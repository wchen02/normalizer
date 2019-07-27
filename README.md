# normalizer
Normalizes data extracted with scraper. Normalizer will parse data json files and populate meaningful data into the transformed data json.

## Features
- Parse and download gallery images
- Parse and download thumbnail image
- Unique UUIDv4 image filename generation
- Prevent malicious file downloads through image filetype detection
- Parse phone number from details
- Write transformed data into a separate file
- Map location to ids
- Add default values

## Getting Started
### How to install

`npm install`

### Running in development mode
Development mode executes only the data/example.json file. In this mode, you will also see the maximum level of logs.

`npm start`

### Running in production mode
Production mode scans all the data files inside data/. In this mode, you will only see warning and error logs.

`npm run start-prod`

### Clean up
You may run the following to clean up downloaded files and normalized data files.

`npm run clean`

## Data JSON
Takes raw data JSON scraped from website and outputs normalized data JSON with image files downloaded into attachs directory.

### Raw Data JSON
```json
{
  "title": "法拉盛小单间出租包水电网",
  "category": "法拉盛租房 FlushingA邮编11355，11354。非中介无佣金出租",
  "text1": "",
  "text2": "",
  "text3": "",
  "num1": "",
  "num2": "",
  "select1": "",
  "select2": "",
  "select3": "",
  "select4": "",
  "select5": "",
  "city": "New York",
  "area": "Flushing",
  "subarea": "",
  "date": "2019/7/26",
  "details": "位于法拉盛SANDFORD AVE，超近MAIN ST商业区，5分钟到7号地铁站，附近有数个大超市，全包水电网，适合单身，上班族，留学生，等等。价钱面谈，提供床架与衣柜，少煮食。\r \r 小间单房：单人$400 - 只限年轻人\r \r 有意者电：646-756-0333\r \r 短信：646-756-033",
  "gallery": [
    "http://c.dadi360.com/c/posts/downloadAttach/722638.page"
  ],
  "longitude": "",
  "latitude": "",
  "photo": "",
  "contact_person": "游客",
  "contact_phone": "",
  "contact_qq": "",
  "contact_address": "",
  "depth": 1,
  "url": "http://c.dadi360.com/c/posts/list/2037621.page"
}
```

### Normalized Data JSON
```json
{
  "title": "法拉盛小单间出租包水电网",
  "text1": null,
  "text2": null,
  "text3": null,
  "num1": null,
  "num2": null,
  "select1": null,
  "select2": null,
  "select3": null,
  "select4": null,
  "select5": null,
  "date": 1564124400,
  "details": "位于法拉盛SANDFORD AVE，超近MAIN ST商业区，5分钟到7号地铁站，附近有数个大超市，全包水电网，适合单身，上班族，留学生，等等。价钱面谈，提供床架与衣柜，少煮食。\r \r 小间单房：单人$400 - 只限年轻人\r \r 有意者电：646-756-0333\r \r 短信：646-756-033",
  "gallery": [
    "attachs/2019/07/26/4665113d-b2c8-4246-99bf-d24be223751e.jpg"
  ],
  "longitude": "",
  "latitude": "",
  "photo": "",
  "contact_person": "游客",
  "contact_phone": "6467560333",
  "contact_qq": "",
  "contact_address": "",
  "depth": 1,
  "url": "http://c.dadi360.com/c/posts/list/2037621.page",
  "cate_id": 47,
  "city_id": 1,
  "area_id": 5,
  "business_id": 1,
  "urgent_date": "2019-07-26",
  "top_date": "2019-07-26",
  "audit": 1,
  "user_id": 2
}
```
