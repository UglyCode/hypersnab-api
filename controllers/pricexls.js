const fs = require('fs');

const handlePricePost = (req, res) => {
    const filePath = `${__dirname}/public/price.xls`;
    receiveFile(filePath,req,res);
};

function receiveFile(filepath, req, res) {

    const limitFileSize = 10000000;
    // non-streaming client sends ctx
    if (req.headers['content-length'] > limitFileSize) {
        res.statusCode = 413;
        res.end('File is too big!');
        return;
    }

    let size = 0;

    let writeStream = new fs.WriteStream(filepath, {flags: 'w'});

    req
        .on('data', chunk => {
            size += chunk.length;

            if (size > limitFileSize) {
                res.statusCode = 413;
                res.setHeader('Connection', 'close');

                // Some browsers will handle this as 'CONNECTION RESET' error
                res.end('File is too big!');

                writeStream.destroy();
                fs.unlink(filepath, err => { // eslint-disable-line
                    /* ignore error */
                });

            }
        })
        .on('close', () => {
            writeStream.destroy();
            fs.unlink(filepath, err => { // eslint-disable-line
                /* ignore error */
            });
        })
        .pipe(writeStream);

    writeStream
        .on('error', err => {
            if (err.code === 'EEXIST') {
                res.statusCode = 409;
                res.end('File exists');
            } else {
                console.error(err);
                if (!res.headersSent) {
                    res.writeHead(500, {'Connection': 'close'});
                    res.end('Internal error');
                } else {
                    res.end();
                }
                fs.unlink(filepath, err => { // eslint-disable-line
                    /* ignore error */
                });
            }

        })
        .on('close', () => {
               res.end('OK');
        });

}

module.exports = {handlePricePost};