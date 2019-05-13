var mongoose = require('mongoose');
var schema = mongoose.Schema;
var nationalTeamSchema = new mongoose.Schema({
  seleccion: {type: Number, ref: 'seleccion'},
  pj: Number,
  puntos: Number,
  golesfav: Number,
  golesec: Number,
  difgoles: Number,
  grupo: String
}, { collection: 'selecgrupos' });

module.exports  = mongoose.model('selecgrupos', nationalTeamSchema);
