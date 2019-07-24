# normalizer
Normalizes data extracted with scraper. Normalizer will parse data json files and populate meaningful data into the transformed data json.

## Features
- Parse and download gallery images
- Unique UUIDv4 image filename generation
- Prevent malicious file downloads through image filetype detection
- Parse phone number from details
- Write transformed data into a separate file

## How to install
`npm install`

## Running in development mode
Development mode executes only the data/example.json file. In this mode, you will also see the maximum level of logs.

`npm start`

## Running in production mode
Production mode scans all the data files inside data/. In this mode, you will only see warning and error logs.

`npm run start-prod`

## Clean up
You may run the following to clean up downloaded files and normalized data files.

`npm run clean`