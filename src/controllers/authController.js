//definir as rotas para registro e autenticação

const express = require('express'); //usado para rotas

const User = require('../models/user'); //usado para login e cadastro

const router = express.Router(); //definir rotas para usuario

router.post('/register', async (req, res) => {
    const { email } = req.body;
    
    //cria um novo usuario ao passar por essa rota
    try {
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists.'});
        
        const user = await User.create(req.body)  //req.body contem todos os parametros do usuario

        user.password = undefined;

        return res.send( { user });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

module.exports = app => app.use('/auth', router);