const express = require('express'); //recebe o pacote express
const bodyParser = require('body-parser');

const app = express(); //criando a aplicacao

app.use(bodyParser.json());  //para que ele entenda quando eu enviar uma requisição para a minha API com infos em json
app.use(bodyParser.urlencoded({ extended: false})); // para que ele entenda quando eu passar parametros via URL para ele decodar esses parametros

/*
//req = os dados da requisição(parametros, token de autenticacao), res = objeto utilizado para enviar resposta para o usuario quando ele acessar essa rota
app.get('/', (req, res) => {  
    res.send('ok');
})
*/

//referenciando o controle de autenticação
require('./controllers/authController')(app);
required('./controllers/projectController')(app);


app.listen(3000);

