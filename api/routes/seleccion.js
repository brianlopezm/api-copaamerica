var express = require('express');
var nationalTeamController = require('../controllers/seleccion');

var api = express.Router();

api.get('/seleccion/getSeleccion/:id',nationalTeamController.getSeleccion);
api.get('/seleccion/getSelecciones/',nationalTeamController.getSelecciones);
api.get('/seleccion/getSeleccionByName/:name',nationalTeamController.getSeleccionByName);
api.patch('/seleccion/updateSeleccion/:id',nationalTeamController.updateSeleccion);
api.post('/seleccion/saveSeleccion',nationalTeamController.saveSeleccion);
api.delete('/seleccion/deleteSeleccion/:id',nationalTeamController.deleteSeleccion);

module.exports = api;
