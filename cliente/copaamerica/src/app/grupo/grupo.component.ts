import { Component, OnInit } from '@angular/core';
import { Observable, throwError} from 'rxjs';
import {GrupoService} from '../Server/grupo.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {

  Grupo:any;
  constructor(private grupoService:GrupoService) { 
  	this.getGrupo("A");
  }

  getGrupo(id){
  	this.grupoService.getGrupo(id).subscribe(resultado =>{
  		this.Grupo=resultado.selecciones;
  	},
  	error =>{
  		console.log(JSON.stringify(error));
  	});
  }


  ngOnInit() {
  }

}
