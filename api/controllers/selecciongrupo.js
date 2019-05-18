let GrupoModel = require('../models/selecciongrupo');
let SeleccionModel= require('../models/seleccion');
let mongoose = require('mongoose');

//Obtener un grupo ordenado primero por puntos, luego por diferencia de goles y luego goles a favor 
function getGroup(req, res){
let find;
let group = req.params.grupo;
    find = GrupoModel.find({grupo: group}).sort({puntos: -1, difgoles: -1, golesfav: -1});
  find.populate({path: 'seleccion'}).exec(function(err,selecciones){
    if(err){
      res.status(500).send({message: 'Error al buscar el grupo'+'\n'+err});
    }else{
      if(!selecciones){
        res.status(404).send({message: 'No hay selecciones'});
      }else{
        res.status(200).send({selecciones});
      }
    }
  });

}

function getSelecGrupo(req,res) {
  GrupoModel.findOne({seleccion:req.params.seleccion},function(err,result){
      if(err){
      res.status(500).send({message: 'Error al buscar la seleccion'+'\n'+err});
    }else{
      if(!result){
        res.status(404).send({message: 'No esta la seleccion'});
      }else{
        res.status(200).send({seleccion: result});
      }
    }
  });
}

//Actualizar un grupo
function updatePuntajeSeleccion(req,res){
  let selId = req.params.id;
  let update = req.body;

  GrupoModel.findByIdAndUpdate(selId,update,{new:true},function(err,result){
    if(err){
      res.status(500).send({message: 'No se ha podido actualizar'+'\n'+err});
    }else{
      if(!result){
        res.status(404).send({message: 'No se ha actualizado'});
      }else{
        console.log(result);
        res.status(200).send({sel: result});
      }
    }
  });
}

//Crea un grupo con 4 selecciones
function newGrupo(req,res){
  var selecciones = [{ seleccion: req.body.sel1, pj: 0, puntos: 0, golesfav: 0, golesec: 0, difgoles:0, grupo: req.body.grupo },
                    { seleccion: req.body.sel2, pj: 0, puntos: 0, golesfav: 0, golesec: 0, difgoles:0, grupo: req.body.grupo },
                    { seleccion: req.body.sel3, pj: 0, puntos: 0, golesfav: 0, golesec: 0, difgoles:0, grupo: req.body.grupo },
                    { seleccion: req.body.sel4, pj: 0, puntos: 0, golesfav: 0, golesec: 0, difgoles:0, grupo: req.body.grupo }];

   GrupoModel.countDocuments({grupo:req.params.grupo},function(err,grupo){
   if(err){
     res.status(501).send({message: 'Error al verificar existencia del grupo'+'\n'+err});
   }else{
       if(grupo>0){            
            if(isDefault(req.body.sel1)||isDefault(req.body.sel2)||isDefault(req.body.sel3)||isDefault(req.body.sel4)){
              res.status(401).send({message: 'Se quiere agregar una seleccion con id=0 - Operacioón Invalida'})
            }else {
              SeleccionModel.countDocuments({$or:[{_id: req.body.sel1},{_id: req.body.sel2},{_id: req.body.sel3},{_id: req.body.sel4}]},function(err, c) {
                     if(err){
                          res.status(500).send({message: 'Ocurrio un problema al buscar las selecciones'+'\n'+err});
                     }else{
                        if(c!=4){
                            res.status(400).send({message: 'No se encuentra alguna de las selecciones'});
                        }
                        else{
                            GrupoModel.collection.insertMany(selecciones, function (err, docs) {
                              if (err){ 
                                res.status(500).send({message: 'No se ha guardado el grupo'+'\n'+err});
                              } else {
                                if(!docs){
                                  res.status(404).send({message: 'No se ha guardado el grupo'});
                                  }else{
                                    res.status(200).send({grupo: docs});
                                  }
                                }
                            });
                        }
                     }
                }); 
              }
            }
       else {res.status(401).send({message: 'Ya hay un grupo con ese nombre'});}
     }
   });
 }

function isDefault(selid){
  if(selid==0)
    return true;
  else return false;
}

//Agregar Seleccion a un grupo que existe

function addSeleccion(req,res){
  let nSel = new GrupoModel();
  let params= req.body;
  if(isDefault(req.body.seleccion)){res.status(401).send({message: 'Se quiere agregar una seleccion con id=0 - Operacioón Invalida'})}
  else {
  SeleccionModel.findOne({_id: req.body.seleccion},function (err,sel){
    if(err){
      res.status(502).send({message: 'Error al encontrar la seleccion'+'\n'+err});
    }
    else{
      if(!sel){
        res.status(402).send({message: 'La seleccion no ha sido encontrado'});
      }
      else {
            GrupoModel.findOne({grupo:req.params.grupo},function(err,seleccion){
            if(err){
              res.status(501).send({message: 'Error al encontrar el grupo'+'\n'+err});
            }else{
              if(!seleccion){
                res.status(400).send({message: 'El grupo no ha sido encontrado'});
              }
              else
                { 
                  nSel.seleccion=params.seleccion;
                  nSel.pj=params.pj;
                  nSel.puntos=params.puntos;
                  nSel.golesfav=params.golesfav;
                  nSel.golesec=params.golesec;
                  nSel.difgoles=params.difgoles;
                  nSel.grupo=req.params.grupo;
                  nSel.save(function(err,selStored){
                  if(err){
                    res.status(500).send({message: 'No se ha agregado la seleccion'+'\n'+err});
                  }else{
                    if(!selStored){
                       res.status(404).send({message: 'No se ha agregado la seleccion'});
                    }else{
                        res.status(200).send({seleccion: selStored});
                      }
                    }
                  });
                }
              }
            });
      }
    }

  });
  }
}

//Elimina un grupo
function deleteGrupo(req,res){
  let grup = req.params.grupo;
  GrupoModel.deleteMany({grupo: grup},function(err,grupo){
    if(err){
      res.status(500).send({message: 'Error al encontrar el grupo'+'\n'+err});
    }else{
      if(!grupo){
        res.status(404).send({message: 'El grupo no ha sido encontrado'});
      }else {
        res.status(200).send({grupo});
      }
    }
  });
}


//Eliminar Seleccion de grupo
function deleteSeleccion(req,res){
  let selId = req.params.id;

  GrupoModel.findByIdAndRemove(selId, function(err,seleccionRemoved){
    if(err){
      res.status(500).send({message: 'Error al eliminar la seleccion'+'\n'+err});
    }else{
      if(!seleccionRemoved){
        res.status(404).send({message: 'La seleccion no ha sido eliminado'});
      }else {
        res.status(200).send({seleccion: seleccionRemoved});
      }
    }
  });
}


module.exports = {
  getGroup,
  updatePuntajeSeleccion,
  deleteGrupo,
  addSeleccion,
  deleteSeleccion,
  getSelecGrupo,
  newGrupo
}
