import { Component, OnInit } from '@angular/core';
import {SeleccionService} from '../Server/seleccion.service';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.css']
})
export class SeleccionComponent implements OnInit {

selecciones:any;
id:any;
  constructor(private seleccionService:SeleccionService) { 
  	this.getSelecciones();
  }

  ngOnInit() {
  }

  getSelecciones(){
  	this.seleccionService.getSelecciones().subscribe(resultado=>{
  		this.selecciones=resultado.selecciones;
  		console.log(resultado);
  	},
  	error =>{
  		console.log(JSON.stringify(error));
  	});
  }

  mostrarid(id){
  	this.id=id;
  }
}
