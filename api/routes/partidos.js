var express = require('express');
var partidosController = require('../controllers/partidos');

var api = express.Router();

api.get('/partidos/getGames/:seleccion',partidosController.getGamesByTeam);
api.get('/partidos/getGames/',partidosController.getAllGames);
api.get('/partidos/getJornada/:jornada',partidosController.getGamesByJornada);
api.get('/partidos/getGame/:id',partidosController.getGameById);
api.patch('/partidos/updateGame/:id', partidosController.updateGame);
api.post('/partidos/saveGame',partidosController.savePartido);
api.delete('/partidos/deleteGame/:id',partidosController.deletePartido);



module.exports = api;
