import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import {FormsModule,ReactiveFormsModule} from '@angular/forms'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GrupoComponent } from './grupo/grupo.component';
import { PartidoComponent } from './partido/partido.component'
import {PartidoService} from './Server/partido.service';
import {GrupoService} from './Server/grupo.service';
import { Routes, RouterModule } from '@angular/router';
import { SeleccionComponent } from './seleccion/seleccion.component';
import {SeleccionService} from './Server/seleccion.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { HomeComponent } from './home/home.component';
const rutas: Routes = [
  { path: 'grupos', component: GrupoComponent },
  { path: 'partidos', component: PartidoComponent },
  { path: 'selecciones', component: SeleccionComponent },
  { path:'',component: HomeComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GrupoComponent,
    PartidoComponent,
    SeleccionComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rutas),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  providers: [GrupoService,PartidoService,SeleccionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
