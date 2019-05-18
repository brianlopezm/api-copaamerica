var mongoose = require('mongoose');
var schema = mongoose.Schema;
var partidoSchema = new mongoose.Schema({
  local: {type: Number, ref: 'seleccion'},
  visitante: {type: Number, ref: 'seleccion'},
  goleslocal: Number,
  golesvisitante: Number,
  lugar: String,
  diahora: Date,
  Jornada: String,
  Estado: String
}, { collection: 'partidos' });

module.exports  = mongoose.model('partido', partidoSchema);
