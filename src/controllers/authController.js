//definir as rotas para registro e autenticação

const express = require('express'); //usado para rotas
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const authConfig = require('../config/auth');

const User = require('../models/user'); //usado para login e cadastro

const router = express.Router(); //definir rotas para usuario

//as informações de autenticação sao guardadas na pasta config, no arquivo json
function generateToken(params = {}){
    return jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400, //equivale a 1 dia
    });
}
router.post('/register', async (req, res) => {
    const { email } = req.body;
    
    //cria um novo usuario ao passar por essa rota
    try {
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists.'});
        
        const user = await User.create(req.body)  //req.body contem todos os parametros do usuario

        user.password = undefined; //remover o password para nao aparecer

        return res.send({ 
            user,
            token: generateToken({ id: user.id}), //passado para logar automaticamente
         });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.post('/autenticate', async( req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({ error: 'User not found.'});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password.'});


    user.password = undefined; //remover o password para nao aparecer
    
      
    res.send({ 
        user,
        token: generateToken({ id: user.id }),
    });
});

module.exports = app => app.use('/auth', router);