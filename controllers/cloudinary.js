const fs = require('fs');
const cloudinary = require('cloudinary');

handlePricePost = (req, res) => {
    stream = cloudinary.uploader.upload_stream(function(result) {
        console.log(result);
        res.send('Done:<br/> <img src="' + result.url + '"/><br/>' +
            cloudinary.image(result.public_id, { format: "png", width: 100, height: 130, crop: "fill" }));
    }, { public_id: req.body.title } );
    fs.createReadStream(req.files.image.path, {encoding: 'binary'}).on('data', stream.write).on('end', stream.end);
};

module.exports = {handlePricePost};