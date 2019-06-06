import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeleccionService {
apiURL ="http://localhost:3000/api";
  constructor(private httpClient: HttpClient) { }

  getSelecciones():Observable<any>{
  	return this.httpClient.get(this.apiURL+"/seleccion/getSelecciones/");
  }

  getSeleccionByName(name):Observable<any>{
  	return this.httpClient.get(this.apiURL+"/seleccion/getSeleccionByName/"+name);
  }
}
