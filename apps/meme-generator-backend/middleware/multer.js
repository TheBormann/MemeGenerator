//Imported the multer package
const multer = require("multer");

const DIR = './public/data/uploads'

/* 
Using uploads directory for the storage configuration of the files 
received by multer,
*/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // use original file name
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === 'image/png' || file.mimetype === 'image/svg') {
        cb(null, true)
    } else {
        //reject file 
        cb({ message: "Unsupported file format" }, false)
    }
}

const upload = multer({
    storage: storage,
    // limits: { fileSize: 1024 * 1024 },
    fileFilter: fileFilter
})

module.exports = upload;