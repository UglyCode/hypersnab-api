const fs = require('fs');

const handlePricePost = (req, res, publicPath) => {
    const filePath = `${publicPath}/price.xls`;
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

    console.log(filepath);

    let size = 0;

    let writeStream = new fs.WriteStream(filepath, {flags: 'w', mode: 0o755 });

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

const handlePriceGet = (req,res, publicPath) => {
    const filePath = `${publicPath}/price.xls`;
    sendFile(filePath,req,res);
};

function sendFile(filepath, req, res) {
    let fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    console.log(filepath);

    fileStream
        .on('error', err => {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('Not found');
            } else {
                console.error(err);
                if (!res.headersSent) {
                    res.statusCode = 500;
                    res.end('Internal error');
                } else {
                    res.end();
                }

            }
        })
        .on('open', () => {
            res.setHeader('Content-Type', 'application/vnd.ms-excel');
        });

    res
        .on('close', () => {
            fileStream.destroy();
        });
}

module.exports = {handlePricePost, handlePriceGet};