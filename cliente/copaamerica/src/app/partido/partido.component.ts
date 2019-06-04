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
updateRes:any={goleslocal:0,golesvisitante:0,Estado:'Jugado'};
resetRes:any={goleslocal:0,golesvisitante:0,Estado:'Por Jugar'};
Partido:any;
actualJornada:string;
selecciones:any;
newPartido:any={local:0,visitante:0,goleslocal:0, golesvisitante:0,lugar:"",diahora:"",Jornada: "",Estado:"Por Jugar"};
bsValue = new Date();
formulario:FormGroup;
edit:any={local:0,visitante:0};
editNames:any={local:"Por Definirse",visitante:"Por Definirse"};


  constructor(private partidoService:PartidoService,private grupoService:GrupoService,private seleccionService:SeleccionService, private fmbuilder:FormBuilder) {
  this.getPartidosByJornada("F1");
  //this.getSelecciones();
  this.formulario=this.fmbuilder.group({
      lugar: [],
      local: ['Por Definirse',Validators.required],
      visitante: ['Por Definirse',Validators.required],
      jornada: ['',Validators.required],
    });
}

  ngOnInit() {
  }
  onSubmit(){
    this.newPartido.diahora=this.bsValue.toJSON();
    this.newPartido.lugar=this.formulario.value.lugar;
    this.newPartido.Jornada=this.formulario.value.jornada;
    this.seleccionService.getSeleccionByName(this.formulario.value.local).subscribe(resultado=>{
        this.newPartido.local=resultado.seleccion._id;
        this.seleccionService.getSeleccionByName(this.formulario.value.visitante).subscribe(resultado=>{
        this.newPartido.visitante=resultado.seleccion._id;
        this.partidoService.agregarPartido(this.newPartido).subscribe();
        this.getPartidosByJornada(this.actualJornada);
        }, error=>{
          console.log(JSON.stringify(error));
        });
    }, error=>{
      console.log(JSON.stringify(error));
    });
  }

  deletePartido(id){
    this.partidoService.eliminarPartido(id).subscribe();
  }
  changeLocal(id,name){this.edit.local=id;this.editNames.local=name;}
  changeVisitante(id,name){this.edit.visitante=id;this.editNames.visitante=name;}
  editarSelec(id){ this.partidoService.updateResultado(this.edit,id).subscribe(resultado=>{
    this.getPartidosByJornada(this.actualJornada);
  });}
  getPartidos(id){
  	this.partidoService.getPartidos().subscribe(resultado =>{
  		this.Partido=resultado.partidos;
  	},
  	error =>{
  		console.log(JSON.stringify(error));
  	});
  }
  getPartidosByJornada(jornada){
    this.partidoService.getPartidosByJornada(jornada).subscribe(resultado =>{
      this.Partido=resultado.partidos;
      this.actualJornada=jornada;
      console.log(resultado);
    },
    error =>{
      console.log(JSON.stringify(error));
    });
  }
   updateResultado(id,local,visitante){
      this.partidoService.updateResultado(this.updateRes,id).subscribe(resultado =>{
       this.getPartidosByJornada(this.actualJornada);
       if(this.actualJornada=="F1"||this.actualJornada=="F2"||this.actualJornada=="F3"){
         this.grupoService.getSeleccion(local).subscribe(res =>{
           this.local=res.seleccion;
           this.grupoService.getSeleccion(visitante).subscribe(res =>{
             this.visitante=res.seleccion;
             this.updateGrupo(1);
             this.grupoService.updatePuntaje(this.local._id,this.local).subscribe();
             this.grupoService.updatePuntaje(this.visitante._id,this.visitante).subscribe();
           });  
         });
       }
       console.log("resultado actualizado",resultado);
     },
     error =>{
       console.log(JSON.stringify(error));
     });
   }

  resetResultado(id,local,visitante,gl,gv){
    if(this.actualJornada=="F1"||this.actualJornada=="F2"||this.actualJornada=="F3"){
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
     return this.partidoService.updateResultado(this.resetRes,id).subscribe(resultado =>{
       this.getPartidosByJornada(this.actualJornada);
       console.log(resultado);
     },
     error =>{
       console.log(JSON.stringify(error));
     });
  }

  updateGrupo(update){
    let usg;
      if(this.updateRes.goleslocal ==this.updateRes.golesvisitante){
        //this.updateSelecGrupo(1);
        usg=1;
        console.log("empataron");
      }else{ 
        if(this.updateRes.goleslocal >this.updateRes.golesvisitante){
          //this.updateSelecGrupo(2);
          usg=2;
          console.log("gano local");
        }
        else {
          //this.updateSelecGrupo(3);
          usg=3;
          console.log("gano visitante");
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

  /*getSelecciones(){
    this.seleccionService.getSelecciones().subscribe(resultado=>{
      this.selecciones=resultado.selecciones;
      console.log(resultado);
    },
    error =>{
      console.log(JSON.stringify(error));
    });
  }*/
}
