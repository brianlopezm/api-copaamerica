var express = require('express');
var nationalTeamController = require('../controllers/selecciongrupo');

var api = express.Router();

api.get('/grupos/getGrupo/:grupo',nationalTeamController.getGroup);
api.get('/grupos/getSeleccion/:seleccion',nationalTeamController.getSelecGrupo);
api.get('/grupos/getAll/',nationalTeamController.getAll);
api.patch('/grupos/updatePuntajeSeleccion/:id', nationalTeamController.updatePuntajeSeleccion);
api.delete('/grupos/deleteGrupo/:grupo',nationalTeamController.deleteGrupo);
api.delete('/grupos/deleteSeleccion/:id',nationalTeamController.deleteSeleccion);
api.post('/grupos/addSeleccion/:grupo',nationalTeamController.addSeleccion);
api.post('/grupos/addGrupo/', nationalTeamController.newGrupo);
module.exports = api;
