//controller que necessita que o usuário esteja autenticado para fazer as requisições
const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/Project');
const Task = require('../models/Task');

const router = express.Router();

router.use(authMiddleware);


//requisição assincrona

//rota de listagem 
router.get('/', async (req, res) => {    
    try {
        const projects = await Project.find().populate('user');

        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects'});
    }
});

//rota para listar por id
router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('user');

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading project'});
    }
});

//rota de criação
router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;
        
        const project = await Project.create({ title, description, user: req.userId });
        
        //aguarda todas as iteracoes que o map executar para depois continuar com o save
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id});
            
            await projectTask.save();
            
            project.tasks.push(projectTask);
        
        }));

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project'});
    }
});

//rota de update(atualizacao)
router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;
        
        const project = await Project.findByIdAndUpdate(req.params.projectId{
             title, 
             description
        }, { new: true}); //retorna o projeto atualizado

        project.tasks = [];
        await Task.remove({ project: project.id});
           
        
        //aguarda todas as iteracoes que o map executar para depois continuar com o save
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...tasks, project: project._id});
            
            await projectTask.save();
            
            project.tasks.push(projectTask);
        
        }));

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project'});
    }
});

//rota para deletar um projeto
router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Error deleting project'});
    }
});

module.exports = app => app.use('/projects', router);

