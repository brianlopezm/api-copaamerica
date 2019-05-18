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

  /*========================================
CRUD Methods for consuming RESTful API
=========================================*/
// Http Options
httpOptions = {
headers: new HttpHeaders({
'Content-Type': 'application/json'
})
}
 
  getGrupo(id: string):Observable<any>{
  	return this.httpClient.get(this.apiURL+"/grupos/getGrupo/"+id);
  }

  getSeleccion(seleccion:string):Observable<any>{
  	return this.httpClient.get(this.apiURL+"/grupos/getSeleccion/"+seleccion);
  }

  updatePuntaje(id,seleccion):Observable<any>{
  	let json= JSON.stringify(seleccion);
  	let headers= new HttpHeaders().set('Content-Type','application/json');
  	return this.httpClient.patch(this.apiURL+"/grupos/updatePuntajeSeleccion/"+id,json,{headers:headers});
  }
}
