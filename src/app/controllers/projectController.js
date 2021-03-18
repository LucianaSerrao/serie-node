//controller que necessita que o usuário esteja autenticado para fazer as requisições
const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
    res.send({ ok: true });
});

module.exports = app => app.use('/projects', router);

