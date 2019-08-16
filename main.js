const dotenv = require('dotenv');
const normalizer = require('./index');

async function main() {
    dotenv.config();
    const options = normalizer.getOptions(process.env);
    await normalizer.run(options);
}

main();