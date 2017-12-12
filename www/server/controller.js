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
		
		console.log("-| INSERTING INTO DB");
		var queryString = "INSERT INTO voto(id_pelicula,id_competencia) VALUES ("+idPelicula+","+idCompetencia+")";
		
		database.query(queryString,function(error,datos){			
			if(error){
				return response.send(500,"ERRRRRROORRRRRR")
			}

			response.send(200,datos);
		});					
	},


	getResultados: function(request, response){
		var idCompetencia = request.params.idCompetencia;
		console.log("-|| GET RESULTADOS: En Request:");		
		console.log("-|| urlParam -> idCompetencia: " + idCompetencia);

		
		// NEW STRING LITERALS IN JS ECMA6
		/*
		var s = 5;
		var s1 = `hola ${s}`
		*/

		console.log("-| SELECTING FROM DB");
		var queryString = `select count(*) as podio, id_pelicula, titulo, competencia.nombre, pelicula.poster 
		from voto
		join pelicula ON voto.id_pelicula = pelicula.id
		join competencia ON voto.id_competencia = competencia.id
		where voto.id_competencia = ${idCompetencia}
		group by id_competencia, id_pelicula
		order by podio DESC
		limit 3`;
		
		console.log("-| QUERY: " + queryString);
		



		database.query(queryString,function(error,datos){			
			if(error){
				return response.send(500,"ERRRRRROORRRRRR")
			}

			var returnObject = {
				competencia:datos[0].nombre,
				resultados:[],
			}

			datos.forEach(function(element, index){
				var result = {
					pelicula_id:datos[index].id_pelicula,
					poster:datos[index].poster,
					titulo:datos[index].titulo,
					votos: datos[index].podio,
				}
				returnObject.resultados.push(result);
			});

			response.send(200,returnObject);
		});					
	}
}

module.exports = controladorFunciones;