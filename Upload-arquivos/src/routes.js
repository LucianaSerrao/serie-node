const routes = require('express').Router();


routes.get("/", (req,res) => {
    return res.json({ hello: "World" });
});


module.exports = routes;