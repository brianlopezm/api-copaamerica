# api-copaamerica

Una API web que contiene selecciones, grupos y partidos. Da la posibilidad de realizar operaciones CRUD sobre todos los esquemas.

## MongoDB

Para importar los datasets ejecutar los siguientes comandos, en el orden mencionado:
```bash 
$ mongoimport --db copaamerica --collection  selecciones--drop --file YOUR_ROUTE_PROJECT/datasets/equipos.json
$ mongoimport --db copaamerica --collection selecgrupos --drop --file YOUR_ROUTE_PROJECT/datasets/grupos.json
$ mongoimport --db copaamerica --collection partidos --drop --file YOUR_ROUTE_PROJECT/datasets/partidos.json
```

## API REST

* Para el server de la API REST utilizar los siguiente comandos:
```bash 
$ cd YOUR_ROUTE_PROJECT/api
$ npm install
$ npm start
```

Finalmente realizar peticiones a `http://localhost:3000/` utilizando la siguiente API:

### Selecciones

Metodo | URL | Descripcion
-------|-----|------------
GET | /seleccion/getSeleccion/:id | Devuelve la seleccion dado un ID.
GET | /seleccion/getSelecciones/ | Devuelve todas las selecciones.
PATCH | /seleccion/updateSeleccion/:id | Modifica la seleccion con el id especificado.
POST | /seleccion/saveSeleccion | Almacena una seleccion.
DELETE | /seleccion/deleteSeleccion/:id | Borra la seleccion con el id especificado. 

### Grupos

Metodo | URL | Descripcion
-------|-----|------------
GET | /grupos/getGrupo/:grupo| Devuelve el grupo especificado
GET | /grupos/getSeleccion/:seleccion| Devuelve una seleccion de un grupo, con sus puntajes, goles..
PATCH | /grupos/updatePuntajeSeleccion/:id| Modifica los puntajes, goles, partidos jugados de una selección.
POST | /grupos/addSeleccion/:grupo | Agrega una seleccion existente en un grupo existente.
POST | /grupos/addGrupo/ | Agrega un nuevo grupo dado un nombre de grupo y 4 id de selecciones existentes.
DELETE | /grupos/deleteGrupo/:grupo | Elimina el grupo especificado. 
DELETE | /grupos/deleteSeleccion/:id| Elimina una seleccion que esta en un grupo con el id especificado. 

### Partidos

Metodo | URL | Descripcion
-------|-----|------------
GET | /partidos/getGames/:seleccion | Devuelve los partidos de una seleccion especificada
GET | /partidos/getGames/ |Devuelve todos los partidos
PATCH | /partidos/updateGame/:id | Actualiza algunos campos de un partido (Selecciones) 
POST | /partidos/saveGame | Almacena un partido
DELETE | /partidos/deleteGame/:id'| Elimina un partido
