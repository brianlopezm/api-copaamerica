import { Component, OnInit } from '@angular/core';
import { Observable, throwError} from 'rxjs';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import {GrupoService} from '../Server/grupo.service';
import { Seleccion } from '../shared/seleccion';
import {SeleccionService} from '../Server/seleccion.service';
import {PartidoService} from '../Server/partido.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})


export class GrupoComponent implements OnInit {
resetSel:any={pj:0,puntos:0,golesfav:0,golesec:0,difgoles:0};
actualgrupo:string;
Grupo:any;
addmsg:any;
newGrupo:any={grupo:"",sel1:0,sel2:0,sel3:0,sel4:0};
formulario:FormGroup;
addSel:FormGroup;
nombresgrupos: String[];

  constructor(private grupoService:GrupoService,private seleccionService:SeleccionService, private fmbuilder:FormBuilder,private partidoServ:PartidoService) { 
  	  this.formulario=this.fmbuilder.group({
      grupo: [],
      sel1: ['0 - Por Definirse',Validators.required],
      sel2: ['0 - Por Definirse',Validators.required],
      sel3: ['0 - Por Definirse',Validators.required],
      sel4: ['0 - Por Definirse',Validators.required],
    });
      this.addSel=this.fmbuilder.group({
        sel:['0 - Por Definirse',Validators.required],
      });
      this.nombresgrupos=[];
  }

  //On Submit del form para Agregar un nuevo grupo
  onSubmit(){
    if(this.formulario.value.grupo!=null){
      this.newGrupo.grupo=this.formulario.value.grupo;
      this.newGrupo.sel1=+this.formulario.value.sel1.substring(0,this.formulario.value.sel1.indexOf('-'));
      this.newGrupo.sel2=+this.formulario.value.sel2.substring(0,this.formulario.value.sel1.indexOf('-'));
      this.newGrupo.sel3=+this.formulario.value.sel3.substring(0,this.formulario.value.sel1.indexOf('-'));
      this.newGrupo.sel4=+this.formulario.value.sel4.substring(0,this.formulario.value.sel1.indexOf('-'));
      
      this.grupoService.addGrupo(this.newGrupo).subscribe(resultado=>{
            alert('Se agrego el grupo '+ this.newGrupo.grupo+" con exito!");
            this.getGrupos();
      },error=>{
            alert(JSON.stringify(error.error.message));
      });
    } else{ alert('No puede existir un grupo sin nombre');}

  }

  //Obtiene un grupo
  getGrupo(id){
    this.actualgrupo=id;
  	this.grupoService.getGrupo(id).subscribe(resultado =>{
  		this.Grupo=resultado.selecciones;
  	},
  	error =>{
  		console.log(JSON.stringify(error));
  	});
  }

  //Resetea los puntajes de una seleccion
  resetSelecGrupo(id){
    this.grupoService.updatePuntaje(id,this.resetSel).subscribe(resultado =>{
      this.getGrupo(this.actualgrupo);
    });
  }

  //Elimina un grupo
  eliminarGrupo(){
    if(confirm('Desea eliminar el grupo '+this.actualgrupo+' ?')){
    this.grupoService.deleteGrupo(this.actualgrupo).subscribe(res=>{
      alert('El grupo se elimino con exito');
      this.nombresgrupos.splice(this.nombresgrupos.indexOf(this.actualgrupo), 1);
      this.getGrupos();
    },error=>{
      alert(JSON.stringify(error.error.message));
    });
  }

  }

//Obtiene todos los grupos con sus seleccions
  getGrupos(){
    this.grupoService.getAll().subscribe(resultado=>{
      this.filtergrupos(resultado);
      this.getGrupo(this.nombresgrupos[0]);
    },error=>{
        alert(JSON.stringify(error.error.message));
    });
  }

//Genera un arreglo con los nombres de los grupos existentes
  filtergrupos(res){
    res.selecciones.forEach(element=> {
      if(this.nombresgrupos.indexOf(element.grupo)==-1){
        this.nombresgrupos.push(element.grupo);
      }
    });
    this.nombresgrupos.sort();
  }


//Agrega una seleccion al grupo
  addSeleccion(){
    if(confirm('Desea agregar la seleccion '+this.addSel.value.sel+' ? ')){
      let sel={seleccion:this.addSel.value.sel.substring(0,this.addSel.value.sel.indexOf('-'))};
      this.grupoService.addSeleccion(sel,this.actualgrupo).subscribe(res=>{
        this.getGrupos();
      },
        error=>{
          alert(JSON.stringify(error.error.message));
        });
    }
  }
//Elimina una seleccion del grupo si no tiene partidos asignados
  deleteSeleccion(id,name){
    if(confirm('Desea eliminar '+name+' del grupo '+this.actualgrupo+' ? ')){
      this.partidoServ.getPartidosBySeleccion(id).subscribe(res=>{
        if(res.partidos.length==0){
            this.grupoService.deleteSeleccion(id).subscribe(res=>{
            alert('Ha sido eliminada del grupo '+this.actualgrupo);
            this.getGrupos();

          },
            error=>{
              alert(JSON.stringify(error.error.message));
            });
        }else {alert("No se puede eliminar, hay partidos asignados a esta seleccion")}

      },error=>{
          alert(JSON.stringify(error.error.message));
      });

    }
  }
  
  ngOnInit() {
    this.seleccionService.getSelecciones().subscribe(resultado=>{
        this.seleccionService.sel=resultado as [];
    },error=>{
      alert(JSON.stringify(error.error.message));
    });
    this.getGrupos();
    
  }

}
