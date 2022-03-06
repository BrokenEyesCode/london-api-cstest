const https = require('https');

/**
 * Get data from the API using the built in HTTPS library, will reject on error.
 * @param {string} url the api domain name.
 * @param {string} path the api data path.
 * @returns {*} Promise containing Json data.
 */
const getData = (url, path) => {
    return new Promise((resolve, reject) => {
        https.get(url + path, (res) => {
            let rawData = '';

            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('error', (e) => {
                console.log('error', e)
                reject(`Got error: ${e.message}`);
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(rawData));
                } catch (e) {
                    reject(e.message);
                }
            });
        })
    });
}
module.exports = {
    getData
}