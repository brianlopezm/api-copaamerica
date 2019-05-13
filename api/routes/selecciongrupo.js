var express = require('express');
var nationalTeamController = require('../controllers/selecciongrupo');

var api = express.Router();

api.get('/grupos/getGrupo/:grupo',nationalTeamController.getGroup);
api.patch('/grupos/updatePuntajeSeleccion/:id', nationalTeamController.updatePuntajeSeleccion);
api.delete('/grupos/deleteGrupo/:grupo',nationalTeamController.deleteGrupo);
api.delete('/grupos/deleteSeleccion/:id',nationalTeamController.deleteGrupo);
api.post('/grupos/addSeleccion/:grupo',nationalTeamController.addSeleccion);
api.post('/grupos/addGrupo/', nationalTeamController.newGrupo);
module.exports = api;
