var mongoose = require('mongoose');
var schema = mongoose.Schema;
var nationalTeamSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  alias: String
}, { collection: 'selecciones' });

module.exports  = mongoose.model('seleccion', nationalTeamSchema);
