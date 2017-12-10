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

		database.query("select count(*) as total from competencia where id = " + competenciaId,function(error,datos){			
			console.log("-| datos.total: " + datos[0].total);
			if(datos[0].total == 0){
				return response.send(418,"NO EXISTE LA COMPETENCIA");
			} else {

				// IF IT EXIST, DO THE QUERY 
				var queryString = "select competencia.id as competencia_id, competencia.nombre, pelicula.id as id, pelicula.titulo, pelicula.poster from pelicula join competencia where competencia.id = " + competenciaId+" order by rand() limit 2";
				
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
		});

		

	},

	votar: function(request, response){
		var idCompetencia = request.params.idCompetencia;
		var idPelicula = request.body.idPelicula;
		console.log("-|| En Request:");		
		console.log("-|| Body: idPelicula (votada): " + idPelicula);
		console.log("-|| urlParam: idCompetencia: " + idCompetencia);
		
		database.query("select count(*) from voto where id_competencia = "+idCompetencia+" AND id_pelicula = "+idPelicula,function(error,existeDato){			
			var existe = existeDato[0].existe;
			console.log("-| Existe?: " + existe);

			// IF THE Competencia DOES NOT EXISTS -> INSERT NEW REGISTRY
			if(existe == 0){
				console.log("-| INSERTING INTO DB");
				var queryString = "INSERT INTO voto(id_pelicula,id_competencia,votos) VALUES ("+idPelicula+","+idCompetencia+",1)";
				
				database.query(queryString,function(error,datos){			
					if(error){
						return response.send(500,"ERRRRRROORRRRRR")
					}

					response.send(200,datos);
				});

			} else {
			// ELSE IF THE Competencia EXISTS -> UPDATE REGISTRY
			console.log("-| UPDATING DB REGISTRY");			
				var queryString = "UPDATE voto SET votos = votos+1 where id_competencia = "+idCompetencia+" AND id_pelicula = "+idPelicula;
				database.query(queryString,function(error,datos){			
					if(error){
						return response.send(500,"ERRRRRROORRRRRR")
					}

					response.send(200,datos);
				});
				
			}
		});			
	}
}

module.exports = controladorFunciones;