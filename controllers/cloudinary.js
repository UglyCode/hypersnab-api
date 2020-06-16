const fs = require('fs');
const cloudinary = require('cloudinary');

handlePricePost = (req, res) => {
    let stream = cloudinary.uploader.upload_stream(function(result) {
        console.log(result);
        res.send('Ok');
    }, { public_id: 'price.xls' });
    req.on('data', stream.write).on('end', stream.end);
};

module.exports = {handlePricePost};