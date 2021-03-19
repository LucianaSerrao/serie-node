//definir as rotas para registro e autenticação

const express = require('express'); //usado para rotas
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');


const authConfig = require('../../config/auth');

const User = require('../../models/user'); //usado para login e cadastro

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

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user)
            return res.status(400).send({ error: 'User not found.'});
        
        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email, 
            from: 'luliserrao@hotmail.com',
            template: 'auth/forgot_password', 
            context: { token },
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Cannot send forgot password email.'});
            
            return res.send();
        })
        
    } catch (err){
        res.status(400).send({ error: 'Error or forgot password. Try again.'});
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email})
        .select('+passwordResetToken passwordResetExpires');

        if(!user)
            return res.status(400).send({ error: 'User not found'});
        
        if(token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid'});

        const now = new Date();

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired. Generate a new one.'});

        user.password = password;

        await user.save();
        
        res.send();
    } catch (err) {
        res.status(400).send({ error: 'Cannot reset password. Try again.'});

    }
})

module.exports = app => app.use('/auth', router);