const fs = require('fs');
const cloudinary = require('cloudinary').v2;

handlePricePost = (req, res) => {
    let stream = cloudinary.uploader.upload_stream({ public_id: 'price.xls', resource_type: "raw"},
        function(error, result) {
            console.log(error, result);
            res.send('Ok');
    });
    req.pipe(stream);
};

module.exports = {handlePricePost};