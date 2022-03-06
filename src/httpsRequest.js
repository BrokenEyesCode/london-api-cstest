const https = require('https');

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