import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Seleccion } from '../shared/seleccion';
import {SeleccionService} from '../Server/seleccion.service';

declare var M: any;

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.css'],
  providers: [ SeleccionService ]
})
export class SeleccionComponent implements OnInit {
  id:any;
  constructor(private seleccionService:SeleccionService) { 
  }
  
  ngOnInit() {  
    this.getAllSeleccion();
    this.getIds();
  }

  getAllSeleccion() {
    this.seleccionService.getSelecciones()
      .subscribe(res => {
        this.seleccionService.sel = res as Seleccion[];
      });
  }

  getIds () {
    this.seleccionService.getIdSeleccion()
      .subscribe(res => {
        this.seleccionService.idArray = res as Number[];
    });
  }

  addSeleccion(form?: NgForm) {
    if(form.value._id) {
      this.seleccionService.putSeleccion(form.value)
        .subscribe(res => {
          this.resetForm(form);
          this.getAllSeleccion();
          M.toast({html: 'Updated Successfully'});
        });
    } else {
      var ArrId = this.seleccionService.idArray["results"];
      var id = Math.max(...ArrId);
      form.value._id = id+1;
      this.seleccionService.postSeleccion(form.value)
        .subscribe(res => {
          this.getAllSeleccion();
          this.getIds();
          this.resetForm(form);
          M.toast({html: 'Save successfully'});
      });
    }
  }
  
  deleteSeleccion(_id: number, form: NgForm) {
    if(confirm('Are you sure you want to delete it?')) {
      this.seleccionService.deleteSeleccion(_id)
        .subscribe(res => {
          this.getAllSeleccion();
          this.resetForm(form);
          M.toast({html: 'Deleted Succesfully'});
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
