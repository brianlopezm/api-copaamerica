import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Seleccion } from '../shared/seleccion';

@Injectable({
  providedIn: 'root'
})
export class SeleccionService {

  sel: Seleccion[];
  selectedSeleccion: Seleccion;
  idArray: Number[];

  apiURL ="http://localhost:3000/api";

  constructor(private httpClient: HttpClient) { 

    this.sel = [];
    this.selectedSeleccion = new Seleccion();
    this.idArray = [];

  }
  getSelecciones(){
    return this.httpClient.get(this.apiURL+"/seleccion/getSelecciones/");
  }

  getSeleccionByName(name):Observable<any>{
  	return this.httpClient.get(this.apiURL+"/seleccion/getSeleccionByName/"+name);
  }

  postSeleccion(seleccion: Seleccion) {
    return this.httpClient.post(this.apiURL+"/seleccion/saveSeleccion", seleccion);
  }

  putSeleccion(seleccion: Seleccion) {
    
    return this.httpClient.put(this.apiURL+"/seleccion/updateSeleccion"+`/${seleccion._id}`, seleccion);
  }

  deleteSeleccion(_id: number) {
    return this.httpClient.delete(this.apiURL+"/seleccion/deleteSeleccion"+`/${_id}`);
  }

  getIdSeleccion(){
    return this.httpClient.get(this.apiURL+"/seleccion/getIdSeleccion/");
  }
}
