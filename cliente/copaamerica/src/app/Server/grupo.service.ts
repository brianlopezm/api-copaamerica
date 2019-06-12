import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';




@Injectable({
  providedIn: 'root'
}
)
export class GrupoService {

 apiURL ="http://localhost:3000/api";
constructor(private httpClient: HttpClient ) {}
 
  getGrupo(id: string):Observable<any>{
  	return this.httpClient.get(this.apiURL+"/grupos/getGrupo/"+id);
  }
  getAll():Observable<any>{
    return this.httpClient.get(this.apiURL+"/grupos/getAll/");
  }

  addGrupo(grupo):Observable<any>{
    let json= JSON.stringify(grupo);
    let headers= new HttpHeaders().set('Content-Type','application/json');
    return this.httpClient.post(this.apiURL+"/grupos/addGrupo/",json,{headers:headers});
  }
  getSeleccion(seleccion:string):Observable<any>{
  	return this.httpClient.get(this.apiURL+"/grupos/getSeleccion/"+seleccion);
  }

  updatePuntaje(id,seleccion):Observable<any>{
  	let json= JSON.stringify(seleccion);
  	let headers= new HttpHeaders().set('Content-Type','application/json');
  	return this.httpClient.patch(this.apiURL+"/grupos/updatePuntajeSeleccion/"+id,json,{headers:headers});
  }

  deleteGrupo(grupo):Observable<any>{
    return this.httpClient.delete(this.apiURL+"/grupos/deleteGrupo/"+grupo);
  }

  addSeleccion(seleccion,grupo):Observable<any>{
    let json= JSON.stringify(seleccion);
    let headers= new HttpHeaders().set('Content-Type','application/json');
    return this.httpClient.post(this.apiURL+"/grupos/addSeleccion/"+grupo,json,{headers:headers});
  }
  deleteSeleccion(id):Observable<any>{
    return this.httpClient.delete(this.apiURL+"/grupos/deleteSeleccion/"+id);
  }
}
