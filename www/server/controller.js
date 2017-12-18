var database = require("./conexion.js");

var controladorFunciones = {

	getCompetencias: function(request, response){

		database.query("SELECT * FROM competencia WHERE activa=1", function(error,datos){
			if(error){
				return response.status(500).send("ERRRRRROORRRRRR")
			}
			//console.log(datos[0]);			
			response.send(200, datos);
		});

	},

	getDatosDeCompetencia: function(request, response){
		
		var idCompetencia = request.params.id;
		var queryString = `select id_pelicula, competencia.nombre as comp_nombre, genero.nombre as genero, actor.nombre as actorNombre, director.nombre as directorNombre  
		from voto
		join pelicula ON voto.id_pelicula = pelicula.id
		join competencia ON voto.id_competencia = competencia.id
		join genero ON pelicula.genero_id = genero.id
		join actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id
		join actor on actor.id = actor_pelicula.actor_id
		join director_pelicula ON director_pelicula.pelicula_id = pelicula.id
		join director on director_pelicula.director_id = director.id
		where voto.id_competencia = ${idCompetencia}
		group by id_competencia, id_pelicula
		limit 1;`;

		database.query(queryString, function(error,datos){
			if(error){
				return response.status(500).send("ERRRRRROORRRRRR")
			}
			//console.log(datos[0]);

			var toFrontEnd = {};

			if(datos.length != 0){

				toFrontEnd.nombre = datos[0].comp_nombre;
				toFrontEnd.genero_nombre = datos[0].genero;
				toFrontEnd.actor_nombre = datos[0].actorNombre;
				toFrontEnd.director_nombre = datos[0].directorNombre;

				return response.send(200, toFrontEnd);
			} else {
				return response.status(404).send("DATOS DE COMPETENCIA VACIOS")								
			}
			
			
			
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

				HAY QUE GET LOS PARAMS DE CREACION DE LA COMPETENCIA (genero, director, actor) Y GENERAR LA QUERY-STRING A PARTIR DE ACA
				REEMPLAZAR LA QUERY DE ABAJO POR "select competencia.genero_id, competencia.director_id, competencia.actor_id from competencia where competencia.id = "+competenciaId+";"
				
				// IF IT EXIST, CHECK IF competencia IS ATTACHED TO A genero
				database.query("select genero_id from competencia where competencia.id =" + competenciaId,function(error,datos){			
					if(error){
						return response.send(500,"ERROR BUSCANDO EL LINK A GENERO DE LA COMPETENCIA")
					}

					var queryString = "";					
					var linkToGenero = datos[0];

					if( linkToGenero == 0){
						queryString = "select competencia.id as competencia_id, competencia.nombre, pelicula.id as id, pelicula.titulo, pelicula.poster from pelicula join competencia where competencia.id = " + competenciaId+" order by rand() limit 2";						
					} else {
						queryString = "select competencia.id as competencia_id, competencia.nombre, pelicula.id as id, pelicula.titulo, pelicula.poster from pelicula join competencia where competencia.id = " + competenciaId+" AND pelicula.genero_id = competencia.genero_id order by rand() limit 2";												
					}

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
	},

	crearCompetencia: function(request, response){
		var nombreComp = request.body.nombre;
		var idGenero = request.body.genero;
		var idDirector = request.body.director;
		var idActor = request.body.actor;

		// GENERAR LA QUERY STRING PARA CHECKEAR SI EXISTEN PELICULAS DENTRO DE LOS PARAMETROS PARA LA COMPETENCIA A CREAR
		var checkIfCombinationExistQueryString = `select count(*) as existe from actor
		join actor_pelicula on actor_pelicula.actor_id = actor.id
		join pelicula on actor_pelicula.pelicula_id = pelicula.id
		join director_pelicula on director_pelicula.pelicula_id = pelicula.id
		join director on director_pelicula.director_id = director.id
		join genero on pelicula.genero_id = genero.id `

		if(idGenero != 0 || idDirector != 0 || idActor != 0){
			checkIfCombinationExistQueryString += "where";

			if(idGenero != 0){
				checkIfCombinationExistQueryString += " genero.id = " + idGenero + " AND";
			}

			if(idDirector != 0){
				checkIfCombinationExistQueryString += " director.id = " + idDirector + " AND";
			}

			if(idActor != 0){
				checkIfCombinationExistQueryString += " actor.id = " + idActor + " AND";
			}

			checkIfCombinationExistQueryString = checkIfCombinationExistQueryString.slice(0,-3);
		}
		console.log("-|| QueryString: " + checkIfCombinationExistQueryString);

		database.query(checkIfCombinationExistQueryString,function(error,datos){
			if(error){
				return response.status(500).send("-||ERROR AL APENAS QUERIEAR")
			}
			console.log("-||Existe ESA COMBINACION: " + datos[0].existe + " REGISTROS");
			if(datos[0].existe == 0){
				return response.status(500).send("-||NO EXISTE ESA COMBINACION PARA CREAR UNA COMPETENCIA")
			} else {

				console.log("-|| CREAR COMPETENCIA: "+ request.body);						
				var queryString = "INSERT INTO competencia(nombre, genero_id, director_id, actor_id, activa) VALUES ('"+nombreComp+"',"+idGenero+","+idDirector+","+idActor+",1)";
		
				database.query(queryString,function(error,datos){
					if(error){
						return response.status(500).send("ERROR CREANDO LA COMPETENCIA")
					}
					response.send(200,datos);
				});	
			}
		});
	},

	reiniciarCompetencia: function(request, response){
		var idCompetencia = request.params.idCompetencia;
		console.log("-|| REINICIAR COMPETENCIA: " +  idCompetencia);						
		
		//var queryString = "DELETE FROM competencia WHERE id="+idCompetencia;
		var queryString = "DELETE FROM voto WHERE id_competencia="+idCompetencia;

		
		database.query(queryString,function(error,datos){
			if(error){
				return response.status(500).send("ERROR DESCONOCIDO DE DATABASE")
			}

			response.send(200); // NO DEVOLVEMOS MENSAJE, EN ESTE CASO, PORQUE EL CLIENTE (reiniciar.JS) NO LEE EL MENSAJE, SOLO EL CODIGO DE ERROR (success:)
			
		});
	},

	getGeneros: function(request, response){
		
		console.log("-|| GETTING GENEROS LIST: ");						
		var queryString = "SELECT * FROM genero";

		database.query(queryString,function(error,datos){
			if(error){
				return response.status(500).send("ERRRRRROORRRRRR")
			}

			response.send(200,datos);
		});		
			

	},

	getDirectores: function(request, response){
		
		console.log("-|| GETTING DIRECTORES LIST: ");						
		var queryString = "SELECT * FROM director";

		database.query(queryString,function(error,datos){
			if(error){
				return response.status(500).send("ERRRRRROORRRRRR")
			}
			response.send(200,datos);
		});		
			

	},

	getActores: function(request, response){
		
		console.log("-|| GETTING ACTORES LIST: ");						
		var queryString = "SELECT * FROM actor";

		database.query(queryString,function(error,datos){
			if(error){
				return response.status(500).send("ERRRRRROORRRRRR")
			}
			response.send(200,datos);
		});		
			

	},

	eliminarCompetencia: function(request, response){
		var idCompetencia = request.params.idCompetencia;
		console.log("-|| ELIMINAR COMPETENCIA: " +  idCompetencia);						
		
		//var queryString = "DELETE FROM competencia WHERE id="+idCompetencia;
		var queryString = "UPDATE competencia SET activa = 0 WHERE id="+idCompetencia+";";

		
		database.query(queryString,function(error,datos){
			if(error){
				return response.status(500).send("ERROR DESCONOCIDO DE DATABASE")
			}

			response.send(200); // NO DEVOLVEMOS MENSAJE, EN ESTE CASO, PORQUE EL CLIENTE (reiniciar.JS) NO LEE EL MENSAJE, SOLO EL CODIGO DE ERROR (success:)
			
		});
	},
}

module.exports = controladorFunciones;