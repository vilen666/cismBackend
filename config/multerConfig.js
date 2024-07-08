// multerConfig.js
const multer = require('multer');
const path = require('path');

// Set up storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

const storage= multer.memoryStorage();

// File filter to only accept images
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|avif|webp/;
//   const mimeType = allowedTypes.test(file.mimetype);
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   if (mimeType && extname) {
//     return cb(null, true);
//   }
//   cb(new Error('Only images are allowed'));
// };
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};
// Set up multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: fileFilter
});
module.exports = upload;
