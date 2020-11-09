const http = require("http");

const options = {
    host: "localhost",
    port: process.env.PORT || 3000,
    timeout: 2000
};

let request = http.request(options, (res) => {
    console.info(`STATUS: ${res.statusMessage}`);
    if (res.statusCode == 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

request.on('error', (err) => {
    console.log('PORT', process.env.PORT);
    console.error(err);
    console.error('ERROR: unexpected error, please check the logs');
    process.exit(1);
});

request.end();
