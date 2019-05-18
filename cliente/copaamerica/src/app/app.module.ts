import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import {FormsModule} from '@angular/forms'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GrupoComponent } from './grupo/grupo.component';
import { PartidoComponent } from './partido/partido.component'
import {PartidoService} from './Server/partido.service';
import {GrupoService} from './Server/grupo.service';
import { Routes, RouterModule } from '@angular/router';
const rutas: Routes = [
 // { path:'/',component: AppComponent},
  { path: 'grupos', component: GrupoComponent },
  { path: 'partidos', component: PartidoComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GrupoComponent,
    PartidoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(rutas)
  ],
  providers: [GrupoService,PartidoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
