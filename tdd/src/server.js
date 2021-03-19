const app = require('./app');

//logica da criacao de porta

//isso facilita o deploy da aplicação; procura-se uma variavel PORT e se nao existir usa a 3000
app.listen(process.env.PORT || 3000);
 