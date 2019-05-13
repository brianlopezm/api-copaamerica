let Seleccion = require('../models/seleccion');
let mongoose = require('mongoose');

//obtiene una saleccion a partir de un id
function getSeleccion(req , res) {
  let id = req.params.id;
  let findOne = Seleccion.findOne({_id: id});
  findOne.exec(function(err,seleccion) {
    if (err) {
      res.status(500).send({message: 'Error al buscar la seleccion'});
    } else {
      if (!seleccion) {
        res.status(404).send({message: 'No hay selecciones'});
      } else {
        res.status(200).send({seleccion});
      }
    }
  });
}

//obtiene todas las selecciones
function getSelecciones(req,res) {
  Seleccion.find({}).sort('name').exec(function(err,selecciones) {
    if (err) {
      res.status(500).send({message: 'Error al buscar las selecciones'});
    } else {
      if (!selecciones) {
        res.status(404).send({message: 'No hay selecciones'});
      } else {
        res.status(200).send({selecciones});
      }
    }
  });
}

//Guarda un nuevo Partido
function saveSeleccion(req,res){
  let seleccion = new Seleccion();

  let params = req.body;
  seleccion._id=params._id;
  seleccion.name=params.name;
  seleccion.alias=params.alias;

  seleccion.save(function(err,seleccionStored){
    if(err){
      res.status(500).send({message: 'No se ha guardado la seleccion'+'\n'+err});
    }else{
      if(!seleccionStored){
        res.status(404).send({message: 'No se ha guardado la seleccion'});
      }else{
        res.status(200).send({Seleccion: seleccionStored});
      }
    }
  });
}


//Actualiza una seleccion a partir de un id
function updateSeleccion(req,res){
  let seleccionId = req.params.id;
  let update = req.body;

  Seleccion.findByIdAndUpdate(seleccionId,update,{new:true},function(err,result){
    if(err){
      res.status(500).send({message: 'No se ha podido actualizar la seleccion'+'\n'+err});
    }else{
      if(!result){
        res.status(404).send({message: 'No se ha actualizado la seleccion'});
      }else{
        res.status(200).send({seleccion: result});
      }
    }
  })

}

//Elimina una seleccion a partir de un id
function deleteSeleccion(req,res){
  let seleccionId = req.params.id;

  Seleccion.findByIdAndRemove(seleccionId, function(err,seleccionRemoved){
    if(err){
      res.status(500).send({message: 'Error al eliminar la seleccion'+'\n'+err});
    }else{
      if(!seleccionRemoved){
        res.status(404).send({message: 'La seleccion no ha sido eliminada'});
      }else {
        res.status(200).send({seleccion: seleccionRemoved});
      }
    }
  });
}

module.exports = {
  getSeleccion,
  getSelecciones,
  updateSeleccion,
  deleteSeleccion,
  saveSeleccion
}
