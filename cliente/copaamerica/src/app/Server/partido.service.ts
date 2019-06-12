import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
	apiURL ="http://localhost:3000/api";
  constructor(private httpClient: HttpClient) { }
  getPartidos():Observable<any>{
  	return this.httpClient.get(this.apiURL+"/partidos/getGames/");
  }
   getPartidosByJornada(jornada):Observable<any>{
  	return this.httpClient.get(this.apiURL+"/partidos/getJornada/"+jornada);
  }
  getPartidosBySeleccion(seleccion):Observable<any>{
    return this.httpClient.get(this.apiURL+"/partidos/getGames/"+seleccion);
  }
  getPartidoById(id):Observable<any>{
  	return this.httpClient.get(this.apiURL+"/partidos/getGame/"+id);
  }
  updateResultado(partido:any,id:string):Observable<any>{
  	let json= JSON.stringify(partido);
    console.log(partido+' '+ id);
  	let headers= new HttpHeaders().set('Content-Type','application/json');
  	return this.httpClient.patch(this.apiURL+"/partidos/updateGame/"+id,json,{headers:headers});
  }

  agregarPartido(partido):Observable<any>{
    let json= JSON.stringify(partido);
    let headers= new HttpHeaders().set('Content-Type','application/json');
    return this.httpClient.post(this.apiURL+"/partidos/saveGame",json,{headers:headers});
  }

  eliminarPartido(id):Observable<any>{
    return this.httpClient.delete(this.apiURL+"/partidos/deleteGame/"+id);
  }
}
