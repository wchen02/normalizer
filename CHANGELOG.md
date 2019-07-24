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
