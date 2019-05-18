let partidoModel = require('../models/partidos');
let mongoose = require('mongoose');
let SeleccionModel= require('../models/seleccion');

//Obtiene Todos los partidos
function getAllGames(req, res){
let find= partidoModel.find().sort({diahora: 1});
find.populate({path: 'local'}).populate({path: 'visitante'}).exec(function(err,partidos){
    if(err){
      res.status(500).send({message: 'Error al buscar los partidos'+'\n'+err});
    }else{
      if(!partidos){
        res.status(404).send({message: 'No hay partidos'});
      }else{
        res.status(200).send({partidos});
      }
    }
  });
}


//Obtiene los Partidos de un equipo
function getGamesByTeam(req, res){
let find;
let sel = req.params.seleccion;
find = partidoModel.find({$or:[{local: sel}, {visitante: sel}]}).sort({diahora: 1});
find.populate({path: 'local'}).populate({path: 'visitante'}).exec(function(err,partidos){
    if(err){
      res.status(500).send({message: 'Error al buscar los partidos'+'\n'+err});
    }else{
      if(!partidos){
        res.status(404).send({message: 'No hay partidos'});
      }else{
        res.status(200).send({partidos});
      }
    }
  });

}

function getGamesByJornada(req, res){
let find;
let jorn = req.params.jornada;
find = partidoModel.find({Jornada: jorn}).sort({diahora: 1});
find.populate({path: 'local'}).populate({path: 'visitante'}).exec(function(err,partidos){
    if(err){
      res.status(500).send({message: 'Error al buscar los partidos'+'\n'+err});
    }else{
      if(!partidos){
        res.status(404).send({message: 'No hay partidos'});
      }else{
        res.status(200).send({partidos});
      }
    }
  });
}

//Actualiza un partido a partir de un id
function updateGame(req,res){
  let gameId = req.params.id;
  let update = req.body;

  partidoModel.findByIdAndUpdate(gameId,update,{new:true},function(err,result){
    if(err){
      res.status(500).send({message: 'No se ha podido actualizar el partido'+'\n'+err});
    }else{
      if(!result){
        res.status(404).send({message: 'No se ha actualizado el partido'});
      }else{
        res.status(200).send({game: result});
      }
    }
  })

}

//Guarda un nuevo Partido
function savePartido(req,res){
  let partido = new partidoModel();

  let params = req.body;
  partido.local = params.local;
  partido.visitante=params.visitante;
  partido.goleslocal=params.goleslocal;
  partido.golesvisitante=params.golesvisitante;
  partido.lugar=params.lugar;
  partido.diahora=params.diahora;

  SeleccionModel.countDocuments({$or:[{_id: params.local},{_id: params.visitante}]},function(err, c){
    if(err){
      res.status(501).send({message: 'Ocurrio un problema al buscar las selecciones'+'\n'+err});
    }
    else{
      if(c!=2){
        res.status(401).send({message: 'No se ha encuentra alguna de las selecciones'});
      }
      else{
            partido.save(function(err,partidoStored){
            if(err){
              res.status(500).send({message: 'No se ha guardado el partido'+'\n'+err});
            }else{
                if(!partidoStored){
                  res.status(404).send({message: 'No se ha guardado el partido'});
                }else{
                  res.status(200).send({partido: partidoStored});
                }
            }
            });
          }
    }
  });
}

//Elimina un partido a partir de un id
function deletePartido(req,res){
  let partidoId = req.params.id;

  partidoModel.findByIdAndRemove(partidoId, function(err,partidoRemoved){
    if(err){
      res.status(500).send({message: 'Error al eliminar el partido'+'\n'+err});
    }else{
      if(!partidoRemoved){
        res.status(404).send({message: 'El partido no ha sido eliminado'});
      }else {
        res.status(200).send({partido: partidoRemoved});
      }
    }
  });
}

module.exports = {
  getGamesByTeam,
  getAllGames,
  getGamesByJornada,
  updateGame,
  savePartido,
  deletePartido
}
