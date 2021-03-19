const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

//multer().single porque estará fazendo 1 upload de arquivo por vez
routes.post("/posts", multer(multerConfig).single("file"), (req,res) => {
    console.log(req.file);
    
    return res.json({ hello: 'Lulis' });
});

module.exports = routes;