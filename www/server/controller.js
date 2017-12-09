var database = require("./conexion.js");

var controladorFunciones = {

	getCompetencias: function(request, response){

		database.query("SELECT * FROM competencia", function(error,datos){
			if(error){
				return response.send("ERRRRRROORRRRRR")
			}
			//console.log(datos[0]);			
			response.send(200, datos);
		});

	},

	getParaVotar: function(request, response){

		var competenciaId = request.params.id;
		
		// CHECK IF Competencia WITH GIVEN ID EXIST IN THE DB

		database.query("select count(*) as total from competencia where id = 4",function(error,datos){			
			console.log(datos.total);
			if(datos.total != 0){
				return response.send(418,"NO EXISTE LA COMPETENCIA");
			}
		});

		// IF IT EXIST, DO THE QUERY 
		var queryString = "select competencia.id as competencia_id, competencia.nombre, pelicula.id as peli_id, pelicula.titulo, pelicula.poster from pelicula join competencia where competencia.id = " + competenciaId+" order by rand() limit 2";
		
		database.query(queryString,function(error,datos){			
			if(error){
				return response.send(500,"ERRRRRROORRRRRR")
			}

			var resultados = {
				competencia:datos[0].nombre,
				peliculas: [],
			}
			resultados.peliculas.push(datos[0]);
			resultados.peliculas.push(datos[1]);
			

			response.send(200,resultados);


		});

	}
}

module.exports = controladorFunciones;