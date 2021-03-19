const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json()); //dessa forma o express consegue lidar com as requisições, com o corpo de mensagens vindo no formato json
app.use(express.urlencoded({ extended: true })); // express lida com requisicao padrao URL encoded (facilita envio de arquivos)
app.use(morgan('dev'));  //biblioteca de log

app.use(require("./routes"));

app.listen(3000);