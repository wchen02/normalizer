#### 1.4.1 (2019-08-16)

##### Bug Fixes

*  long attach file name causing loader to not able to safe to db ([e45801be](https://github.com/wchen02/normalizer/commit/e45801be983c1eb5a1fbed43ec20287ca6ed6744))

### 1.4.0 (2019-08-16)

##### New Features

*  Add getOptions method into lib ([642c55d7](https://github.com/wchen02/normalizer/commit/642c55d7e3e95682a94bd96ef2b95ff38225ae39))

### 1.3.0 (2019-08-16)

##### Chores

*  update example .env ([4a48af18](https://github.com/wchen02/normalizer/commit/4a48af18fda1af9e3edb189dba48610cab4acb94))

##### New Features

*  Make directories configurable vai env var ([1c674eac](https://github.com/wchen02/normalizer/commit/1c674eacac02f185d66cc2c922e0ba6986a0de17))

### 1.2.0 (2019-08-11)

##### New Features

*  download and generate thumbnail ([95d1b627](https://github.com/wchen02/normalizer/commit/95d1b6272c461470d6fa4039164122d8d698d596))

### 1.1.0 (2019-08-03)

##### New Features

*  Support processing data file with array of dataJson, added max concurrency configuration, normalized file are now written to unique key ([0b13e695](https://github.com/wchen02/normalizer/commit/0b13e695c2f4560f3ddc2a73a767a1a5d5fe36d7))
*  Support pass in data file to process in development via env variable ([3ca76fae](https://github.com/wchen02/normalizer/commit/3ca76fae7a4bb2b78adefd0793941300b47c9611))

##### Bug Fixes

*  Forgot to convert last time ([c8800c7b](https://github.com/wchen02/normalizer/commit/c8800c7be519e5ac834779dc5a01cf95374739fa))

## 1.0.0 (2019-07-27)

##### Documentation Changes

*  Prepare Readme for major release ([0717abac](https://github.com/wchen02/normalizer/commit/0717abac6a17393ef2a7a398386af77f09d9d470))
*  Update Readme ([669a93d0](https://github.com/wchen02/normalizer/commit/669a93d0b1b4e4284af47381d2438068ebc31dd2))

##### Refactors

*  Move env vars from script to dotenv, updated example json ([ad3b236b](https://github.com/wchen02/normalizer/commit/ad3b236b9d636ca3a792d506c87346f1f1ce1343))

### 0.6.0 (2019-07-27)

##### New Features

*  Rename download dir to attachs, download thumbnail image, add error handling, standardized logging ([696caf76](https://github.com/wchen02/normalizer/commit/696caf76baea76a9fc43b091e9c0dd642482fdeb))
*  Add more default values ([81c91836](https://github.com/wchen02/normalizer/commit/81c91836af2812a57dc5245d93361b0e2c08965f))
*  Add missing field default values ([41cb962d](https://github.com/wchen02/normalizer/commit/41cb962d8a8cb3beb4c5e383f9c1c67d3eed77a7))

### 0.5.0 (2019-07-27)

##### Breaking Changes

*  update data json schema ([93270ad8](https://github.com/wchen02/normalizer/commit/93270ad828f0fd1d0821f70440e7d4c223c748bb))

##### Chores

*  keeping normalized dir, remove example.json ([4de43212](https://github.com/wchen02/normalizer/commit/4de43212d91989b52a869f649d71a73139d5171c))

##### New Features

*  Parse and convert date to timestamp ([603fde0a](https://github.com/wchen02/normalizer/commit/603fde0a710b6637f31ef1eb9e95f91b91180822))
*  map city, area, and subarea to ids ([55264aab](https://github.com/wchen02/normalizer/commit/55264aabe4fa024849a95c934a2b26a2e7a861fb))
*  map category to category Id ([a761c5b7](https://github.com/wchen02/normalizer/commit/a761c5b795bca5fe30fd00062ebc9dc89296adee))

##### Bug Fixes

*  update to use the full category name ([3a288315](https://github.com/wchen02/normalizer/commit/3a2883150d5c34a36c0d5fc1408e28eba93b5525))

#### 0.4.1 (2019-07-24)

##### Documentation Changes

*  Update readme ([42d110ab](https://github.com/wchen02/normalizer/commit/42d110abfbccc223744d3c7b638f29b10141aa95))

##### Bug Fixes

*  Fix wrong log level in start-prod script ([03ab3f96](https://github.com/wchen02/normalizer/commit/03ab3f96131a85169a1b243d2b8afeaf2bd45cf1))

### 0.4.0 (2019-07-24)

##### Documentation Changes

*  Update readme ([c2f2a3d6](https://github.com/wchen02/normalizer/commit/c2f2a3d6ec1960a459490b1cac181b2e163a4b5f))

##### New Features

*  Write transformed file to data dir, update clean script to clean normalized data dir as well ([e1ac48eb](https://github.com/wchen02/normalizer/commit/e1ac48eb264ac85941f16dfc6dabd420c382fd81))

##### Performance Improvements

*  avoid scanning data dir for development mode ([109749ea](https://github.com/wchen02/normalizer/commit/109749eaeacca188b6e45919ebaca6c4fe5bdc63))

##### Refactors

*  Refactor code to use jsonfile package. ([e59b9ffd](https://github.com/wchen02/normalizer/commit/e59b9ffde62da89f870a0313fd9fdc171791c7c6))

### 0.3.0 (2019-07-23)

##### New Features

*  Parse phone number from details if not present. maintain a transformed data object to be written to disk later, enable development mode ([a2d7d4a9](https://github.com/wchen02/normalizer/commit/a2d7d4a9cd7064120c4f81f201da2b82487ae153))
*  Add hiding log based on log level set in ENV, add clean script ([8cb807b1](https://github.com/wchen02/normalizer/commit/8cb807b18fdd6240a313ba696fa21b00a05aff52))
*  detect filetype and only save images to disk ([d2dab8ee](https://github.com/wchen02/normalizer/commit/d2dab8ee9f7385f83425cef08a100c956abc3b13))

### 0.2.0 (2019-07-23)

##### New Features

*  Reads data dir and downloads galleries of all data files ([f25e1d30](https://github.com/wchen02/normalizer/commit/f25e1d3092c528b5ef15486a7037a8d668884690))

### 0.1.0 (2019-07-22)

##### Chores

*  Add downloads dir ([5591a2a6](https://github.com/wchen02/normalizer/commit/5591a2a67a8e72cc4c1a34b704d7fe5745796e8b))
*  Update example.json with gallery ([9631c8b5](https://github.com/wchen02/normalizer/commit/9631c8b5575de73d00d27e34fa32d40544a62f71))
*  Add sample json data file, add eslint support ([80188762](https://github.com/wchen02/normalizer/commit/80188762deeeb9c8174c8079b9d1bdd6f6453330))
*  Added download and load-json-file packages ([ece59e17](https://github.com/wchen02/normalizer/commit/ece59e17708ac8d537b805c15f4b989480a469e1))
*  Added generate-changelog ([ad52ff63](https://github.com/wchen02/normalizer/commit/ad52ff6314a2122fb891371a67d10e7be12c049a))

##### New Features

*  Download gallery images from data json and save to downloads dir ([b51eebce](https://github.com/wchen02/normalizer/commit/b51eebce857a88713c9826ff64cf6610690cdb81))

