import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import {PartidoService} from '../Server/partido.service';
import {GrupoService} from '../Server/grupo.service';
import {SeleccionService} from '../Server/seleccion.service';
import { Observable} from 'rxjs';


@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.css']
})
export class PartidoComponent implements OnInit {
local:any;
visitante:any;
updateRes:any;
resetRes:any;
Partido:any;
actualJornada:string;
selecciones:any;
newPartido:any;
bsValue = new Date();
formulario:FormGroup;
editform:FormGroup;
edit:any;
editId:any;
editNames:any;
partidoedit:any;
tipoJorn:number;
newJornada:string;
jornadasgrupo:string[];
jornadasfinales:string[];
tipogrupo:string[];
  constructor(private partidoService:PartidoService,private grupoService:GrupoService,private seleccionService:SeleccionService, private fmbuilder:FormBuilder) {
  this.updateRes={goleslocal:0,golesvisitante:0,Estado:'Jugado'};
  this.resetRes={goleslocal:0,golesvisitante:0,Estado:'Por Jugar'};
  this.newPartido={local:0,visitante:0,goleslocal:0, golesvisitante:0,lugar:"",diahora:"",Jornada: "",Estado:"Por Jugar",tipo:""};
  this.edit={local:0,visitante:0};
  this.editNames={local:"Por Definirse",visitante:"Por Definirse"};
  this.partidoedit={_id:0,local:0,visitante:0};
  this.tipogrupo=["Fase Grupos","Fase Final"];
  this.jornadasgrupo=[];
  this.jornadasfinales=[];
  this.getSelecciones();
  this.getPartidos();
  this.formulario=this.fmbuilder.group({
      lugar: [],
      local: ['Por Definirse',Validators.required],
      visitante: ['Por Definirse',Validators.required],
      jornada: ['',Validators.required],
      tipo:['Fase Grupos',Validators.required],
    });
  this.editform=this.fmbuilder.group({
    local:['0-Por Definirse',Validators.required],
    visitante:['0-Por Definirse',Validators.required],
  });
}

  ngOnInit() {
  }
  partidoParcial(id,local,visitante){
    this.partidoedit._id=id;
    this.partidoedit.local=local;
    this.partidoedit.visitante=visitante;
  }
  setTipoJornada(id){
    this.tipoJorn=id;
  }

  //Agrega una nueva jornada 
  addJornada(){
    if(this.formulario.value.tipo=="Fase Grupos"){
      if(this.jornadasgrupo.indexOf(this.newJornada)==-1){
           this.jornadasgrupo.push(this.newJornada);
      }else{
        alert("Ya existe una jornada de Fase de Grupos con ese nombre")}
   }else{  
       if(this.jornadasfinales.indexOf(this.newJornada)==-1){
           this.jornadasgrupo.push(this.newJornada);
        }else {alert("Ya existe una jornada de Fase Final con ese nombre")}

   } 
  }


  //OnSumbit del form de agregar un partido
  onSubmit(){
    this.newPartido.diahora=this.bsValue.toJSON();
    this.newPartido.lugar=this.formulario.value.lugar;
    this.newPartido.Jornada=this.formulario.value.jornada;
    this.newPartido.tipo=this.formulario.value.tipo;
    this.seleccionService.getSeleccionByName(this.formulario.value.local).subscribe(resultado=>{
        this.newPartido.local=resultado.seleccion._id;
        this.seleccionService.getSeleccionByName(this.formulario.value.visitante).subscribe(resultado=>{
        this.newPartido.visitante=resultado.seleccion._id;
        this.partidoService.agregarPartido(this.newPartido).subscribe(resultado=>{
          this.actualJornada=this.newPartido.Jornada;
          this.getPartidosByJornada(this.actualJornada);
          alert("Partido Agregado con Exito!");
        },error=>{
            alert(JSON.stringify(error));
            });
        }, error=>{
          alert(JSON.stringify(error));
        });
    }, error=>{
      alert(JSON.stringify(error));
    });
  }

//Elimina un partido
  deletePartido(id){
    if(confirm('Seguro que quiere eliminar el partido?')){
      this.partidoService.eliminarPartido(id).subscribe(res=>{
          this.getPartidosByJornada(this.actualJornada);
          alert("Partido Eliminado con Exito!");
      },error=>{
            alert(JSON.stringify(error));
      });}
  }


  setEditId(id){this.editId=id;}
  
  //Edita las selecciones de un partido
  editarSelec(){ 
    this.edit.local=+this.editform.value.local.substring(0,this.editform.value.local.indexOf('-'));
    this.edit.visitante=+this.editform.value.visitante.substring(0,this.editform.value.visitante.indexOf('-'));
    this.partidoService.updateResultado(this.edit,this.editId).subscribe(resultado=>{
    this.getPartidosByJornada(this.actualJornada);
  });}
  
  //Obtiene todos los partidos
  getPartidos(){
  	this.partidoService.getPartidos().subscribe(resultado =>{
      this.getJornadas(resultado);
  	},
  	error =>{
  		alert(JSON.stringify(error));
  	});
  }
  
  //Obtiene los partidos de una jornada dada
  getPartidosByJornada(jornada){
    this.partidoService.getPartidosByJornada(jornada).subscribe(resultado =>{
      this.Partido=resultado.partidos;
      this.actualJornada=jornada;
    },
    error =>{
      alert(JSON.stringify(error));
    });
  }

  //Actualiza un partido
   updateResultado(){
      this.partidoService.updateResultado(this.updateRes,this.partidoedit._id).subscribe(resultado =>{
       this.getPartidosByJornada(this.actualJornada);
       if(this.jornadasgrupo.indexOf(this.actualJornada)!=-1){
         this.grupoService.getSeleccion(this.partidoedit.local._id).subscribe(res =>{
           this.local=res.seleccion;
           this.grupoService.getSeleccion(this.partidoedit.visitante._id).subscribe(res =>{
             this.visitante=res.seleccion;
             this.updateGrupo(1);
             this.grupoService.updatePuntaje(this.local._id,this.local).subscribe();
             this.grupoService.updatePuntaje(this.visitante._id,this.visitante).subscribe();
           });  
         });
       }
       alert("Resultado actualizado");
     },
     error =>{
       alert(JSON.stringify(error));
     });
   }

//Resetea un partido
  resetResultado(id,local,visitante,gl,gv){
   if(this.jornadasgrupo.indexOf(this.actualJornada)!=-1){
      this.updateRes.goleslocal=gl;
      this.updateRes.golesvisitante=gv;
      this.grupoService.getSeleccion(local).subscribe(res =>{
         this.local=res.seleccion;
         this.grupoService.getSeleccion(visitante).subscribe(res =>{
           this.visitante=res.seleccion;
           this.updateGrupo(0);
           this.grupoService.updatePuntaje(this.local._id,this.local).subscribe();
           this.grupoService.updatePuntaje(this.visitante._id,this.visitante).subscribe();
         });  
       });
    }
       this.partidoService.updateResultado(this.resetRes,id).subscribe(resultado =>{
       this.getPartidosByJornada(this.actualJornada);
     },
     error =>{
       alert(JSON.stringify(error));
     });
  }

//Actualizacion de los puntajes de una seleccion de un grupo
  updateGrupo(update){
    let usg;
      if(this.updateRes.goleslocal ==this.updateRes.golesvisitante){
        usg=1;
      }else{ 
        if(this.updateRes.goleslocal >this.updateRes.golesvisitante){
          usg=2;
        }
        else {
          usg=3;
        }

      }
      if(update==1){
        this.updateSelecGrupo(usg);
      }else {
        this.resetSelecGrupo(usg);
      }
  }


  //Prepara JSON de las selecciones segun su resultado en el partido
  updateSelecGrupo(id_res){
    this.local.pj=this.local.pj+1;
    this.local.golesfav=this.local.golesfav+this.updateRes.goleslocal;
    this.local.golesec=this.local.golesec+this.updateRes.golesvisitante;
    this.local.difgoles=this.local.difgoles+this.updateRes.goleslocal-this.updateRes.golesvisitante;

    this.visitante.pj=this.visitante.pj+1;
    this.visitante.golesfav=this.visitante.golesfav+this.updateRes.golesvisitante;
    this.visitante.golesec=this.visitante.golesec+this.updateRes.goleslocal;
    this.visitante.difgoles=this.visitante.difgoles+this.updateRes.golesvisitante-this.updateRes.goleslocal;

    if(id_res==1){
      this.local.puntos=this.local.puntos+1;
      this.visitante.puntos=this.visitante.puntos+1;
    }
    else if(id_res==2){
      this.local.puntos=this.local.puntos+3;
    } else {
      this.visitante.puntos=this.visitante.puntos+3;
    }
  }

  //Prepara el JSON para resetear el puntaje de una seleccion restandole el partido que habia jugado
  resetSelecGrupo(id_res){
    this.local.pj=this.local.pj-1;
    this.local.golesfav=this.local.golesfav-this.updateRes.goleslocal;
    this.local.golesec=this.local.golesec-this.updateRes.golesvisitante;
    this.local.difgoles=this.local.difgoles-this.updateRes.goleslocal+this.updateRes.golesvisitante;

    this.visitante.pj=this.visitante.pj-1;
    this.visitante.golesfav=this.visitante.golesfav-this.updateRes.golesvisitante;
    this.visitante.golesec=this.visitante.golesec-this.updateRes.goleslocal;
    this.visitante.difgoles=this.visitante.difgoles-this.updateRes.golesvisitante+this.updateRes.goleslocal;

    if(id_res==1){
      this.local.puntos=this.local.puntos-1;
      this.visitante.puntos=this.visitante.puntos-1;
    }
    else if(id_res==2){
      this.local.puntos=this.local.puntos-3;
    } else {
      this.visitante.puntos=this.visitante.puntos-3;
    }
  }

//Obtiene las selecciones 
  getSelecciones(){
    this.seleccionService.getSelecciones().subscribe(resultado=>{
      this.selecciones=resultado.selecciones;
    },
    error =>{
      alert(JSON.stringify(error));
    });
  }

  //Genera los arreglos de jornadas fase de grupos y finales 
  getJornadas(resultado){
    resultado.partidos.forEach(element=> {
      if(element.tipo=="Fase Grupos"){
         if(this.jornadasgrupo.indexOf(element.Jornada)==-1){
            this.jornadasgrupo.push(element.Jornada);
          }
      }else{
        if(element.tipo=="Fase Final"){
          if(this.jornadasfinales.indexOf(element.Jornada)==-1){
            this.jornadasfinales.push(element.Jornada);
          }
        }
      }
     
    });
  }
}
