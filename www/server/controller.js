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
		
		var queryString = "select competencia.id as competencia_id, competencia.nombre, pelicula.id as peli_id, pelicula.titulo, pelicula.poster from pelicula join competencia where competencia.id = " + competenciaId+" order by rand() limit 2";
		
		database.query(queryString,function(error,datos){			
			if(error){
				return response.send("ERRRRRROORRRRRR")
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