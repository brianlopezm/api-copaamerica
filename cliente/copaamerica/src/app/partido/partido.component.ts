import { Component, OnInit } from '@angular/core';
import {PartidoService} from '../Server/partido.service';
import {GrupoService} from '../Server/grupo.service';
import {GrupoComponent} from '../grupo/grupo.component';
import { Observable} from 'rxjs';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.css']
})
export class PartidoComponent implements OnInit {
local:any;
visitante:any;
updateRes:any={goleslocal:'0',golesvisitante:'0',Estado:'Jugado'};
resetRes:any={goleslocal:'0',golesvisitante:'0',Estado:'Por Jugar'};
Partido:any;
actualJornada:string

  constructor(private partidoService:PartidoService,private grupoService:GrupoService) {
  this.getPartidosByJornada("F1");
}

  ngOnInit() {
  }
  getPartidos(){
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
     return this.partidoService.updateResultado(this.updateRes,id).subscribe(resultado =>{
       this.getPartidosByJornada(this.actualJornada);
       this.grupoService.getSeleccion(local).subscribe(res =>{
         this.local=res.seleccion;
         this.grupoService.getSeleccion(visitante).subscribe(res =>{
           this.visitante=res.seleccion;
           this.updateGrupo();
           this.grupoService.updatePuntaje(this.local._id,this.local).subscribe();
           this.grupoService.updatePuntaje(this.visitante._id,this.visitante).subscribe();
         });
       });
       console.log("resultado actualizado",resultado);
     },
     error =>{
       console.log(JSON.stringify(error));
     });
  }

  resetResultado(id){
     return this.partidoService.updateResultado(this.resetRes,id).subscribe(resultado =>{
       this.getPartidosByJornada(this.actualJornada);
       console.log(resultado);
     },
     error =>{
       console.log(JSON.stringify(error));
     });
  }

  updateGrupo(){
    if(this.actualJornada=="F1"||this.actualJornada=="F2"||this.actualJornada=="F3"){
      if(this.updateRes.goleslocal ==this.updateRes.golesvisitante){
        this.updateSelecGrupo(1);
        console.log("empataron");
      }else{ 
        if(this.updateRes.goleslocal >this.updateRes.golesvisitante){
          this.updateSelecGrupo(2);
          console.log("gano local");
        }
        else {
          this.updateSelecGrupo(3);
          console.log("gano visitante");
        }

      }
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
    else if(id_res=2){
      this.local.puntos=this.local.puntos+3;
    } else {
      this.visitante.puntos=this.visitante.puntos+3;
    }
    console.log("dentro de updateSelecGrupo");
    console.log(this.local);
    console.log(this.visitante);
  }
}
