//o middleware vai interceptar a requisição entre o controller e a parte da rota; pega o req e o res e verifica se eles estao validos para poder receber a resposta do controller
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');


export default (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({ error: 'No token provided.' });
    
    const parts = authHeader.split(' ');
    
    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token error.' });

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatted.' });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Token invalid.' });
        
        //incluir infos do user id nas proximas requisicoes pro controller
        req.userId = decoded.id;
        return next();
    });
};