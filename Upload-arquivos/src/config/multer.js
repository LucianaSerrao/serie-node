const multer = require('multer');
const path = require('path');
const crypto = require('crypto');


module.exports = {
    //dest determina o destino dos arquivos ao fazer upload
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if(err) cb(err);
                
                //define com template strings para usar uma varíável dentro de uma string
                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, fileName);
            });
        },
    }),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'img/pjpeg',
            'img/png',
            'img/gif'
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        }else {
            cb(new Error('Invalid file type'));
        }
    },
};