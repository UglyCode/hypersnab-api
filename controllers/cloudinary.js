const fs = require('fs');
const cloudinary = require('cloudinary');

handlePricePost = (req, res) => {
    stream = cloudinary.uploader.upload_stream(function(result) {
        console.log(result);
        res.send('Ok');
    }, { public_id: 'price.xls' });
    fs.createReadStream(req, {encoding: 'binary'}).on('data', stream.write).on('end', stream.end);
};

module.exports = {handlePricePost};