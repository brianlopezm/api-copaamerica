import { Component, OnInit } from '@angular/core';
import { Observable, throwError} from 'rxjs';
import {GrupoService} from '../Server/grupo.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})


export class GrupoComponent implements OnInit {
resetSel:any={pj:0,puntos:0,golesfav:0,golesec:0,difgoles:0};
actualgrupo:string;
  Grupo:any;
  constructor(private grupoService:GrupoService) { 
  	this.getGrupo("A");
  }

  getGrupo(id){
    this.actualgrupo=id;
  	this.grupoService.getGrupo(id).subscribe(resultado =>{
  		this.Grupo=resultado.selecciones;
  	},
  	error =>{
  		console.log(JSON.stringify(error));
  	});
  }

  resetSelecGrupo(id){
    this.grupoService.updatePuntaje(id,this.resetSel).subscribe(resultado =>{
      this.getGrupo(this.actualgrupo);
    });
  }


  ngOnInit() {
  }

}
