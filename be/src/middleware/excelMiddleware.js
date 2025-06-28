// import multer from 'multer';
// import path from 'path';

// // Multer configuration for file upload
// const storage = multer.memoryStorage();
// export const uploadExcel = multer({
//     storage: storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB limit
//     },
//     fileFilter: (req, file, cb) => {
//         const allowedExtensions = ['.xlsx', '.xls'];
//         const fileExtension = path.extname(file.originalname).toLowerCase();

//         if (allowedExtensions.includes(fileExtension)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'), false);
//         }
//     }
// }).single('excel_file');