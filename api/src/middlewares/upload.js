const multer = require("multer");
const path = require("path");

var fileFilter = (req, file, cb) => {
    if(file) {
      file.mimetype === "image/jpeg" || file.mimetype === "image/png" ? cb(null, true) : cb(new Error("The file must be in jpeg / png format"), false);
    } else {
        cb(new Error("Sorry, file upload failed."))
    }
};

var storage = multer.diskStorage ({
    destination: function (req, file, cb) {
      cb(null, __dirname.replace( "middlewares","public\\uploads"))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
  })

var limits = {fileSize: 5 * 1024 * 1024}

module.exports = {
    fileFilter,
    storage,
    limits
}