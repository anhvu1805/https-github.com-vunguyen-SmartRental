const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Trỏ trực tiếp vào thư mục uploads bạn đã có
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Đặt tên file: TIMESTAMP-TENFILEGOC.jpg
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb("Error: Chỉ cho phép tải lên hình ảnh!");
    }
});

module.exports = upload;