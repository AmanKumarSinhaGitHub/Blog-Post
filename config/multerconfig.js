const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Disk store setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, name) {
            const fileName = name.toString("hex") + path.extname(file.originalname);
            cb(null, fileName);
        })
    }
});

const upload = multer({ storage: storage });

// Export upload variable
module.exports = upload;
