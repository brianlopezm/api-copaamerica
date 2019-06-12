import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Seleccion } from '../shared/seleccion';
import {SeleccionService} from '../Server/seleccion.service';
import {PartidoService} from '../Server/partido.service';

declare var M: any;

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.css'],
  providers: [ SeleccionService ]
})
export class SeleccionComponent implements OnInit {
  id:any;
  constructor(private seleccionService:SeleccionService,private partidoService:PartidoService) { 
  }
  
  ngOnInit() {  
    this.getAllSeleccion();
    this.getIds();
  }

//Obtiene todas las selecciones
  getAllSeleccion() {
    this.seleccionService.getSelecciones()
      .subscribe(res => {
        this.seleccionService.sel = res as Seleccion[];
      });
  }

  //Obtiene todos los id de las selecciones
  getIds () {
    this.seleccionService.getIdSeleccion()
      .subscribe(res => {
        this.seleccionService.idArray = res as Number[];
    });
  }

//Agrega una seleccion o la modifica
  addSeleccion(form?: NgForm) {
    if(form.value._id) {
      console.log(form.value._id);
      this.seleccionService.putSeleccion(form.value)
        .subscribe(res => {
          this.resetForm(form);
          this.getAllSeleccion();
          //M.toast({html: 'Updated Successfully'});
        });
    } else {
      console.log(form.value._id);
      var ArrId = this.seleccionService.idArray["results"];
      var id = Math.max(...ArrId);
      form.value._id = id+1;
      this.seleccionService.postSeleccion(form.value)
        .subscribe(res => {
          this.getAllSeleccion();
          this.getIds();
          this.resetForm(form);
          //M.toast({html: 'Save successfully'});
      });
    }
  }
  
  //Elimina una seleccion si no tiene partidos
  deleteSeleccion(_id: number, form: NgForm) {
    if(confirm('Esta seguro de eliminar la seleccion?')) {
        this.partidoService.getPartidosBySeleccion(_id).subscribe(res=>{
          if(res.partidos.length==0){
            this.seleccionService.deleteSeleccion(_id)
          .subscribe(res => {
            this.getAllSeleccion();
            this.resetForm(form);
            //M.toast({html: 'Deleted Succesfully'});
          },error=>{
              alert(JSON.stringify(error.error.message));
          });
        }else {alert("No se puede eliminar, hay partidos asignados a esta seleccion")}

      },error=>{
          alert(JSON.stringify(error.error.message));
      });
    }
  }

  editSeleccion(seleccion: Seleccion) {
    this.seleccionService.selectedSeleccion = seleccion;
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.seleccionService.selectedSeleccion = new Seleccion();
    }
  }

  mostrarid(id){
  	this.id=id;
  }
}
