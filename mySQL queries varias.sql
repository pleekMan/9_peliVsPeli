select id_pelicula, titulo, competencia.nombre as comp_nombre, genero.nombre as genero, actor_pelicula.id as ActorID, actor.nombre as actorNombre, director_pelicula.director_id as DirID, director.nombre as directorNombre
		from voto
		join pelicula ON voto.id_pelicula = pelicula.id
		join competencia ON voto.id_competencia = competencia.id
		join genero ON pelicula.genero_id = genero.id
		join actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id
		join actor on actor.id = actor_pelicula.actor_id
		join director_pelicula ON director_pelicula.pelicula_id = pelicula.id
		join director on director_pelicula.director_id = director.id
		where voto.id_competencia = 2
		group by id_competencia, id_pelicula
		limit 1;
		
select nombre_peli, nombre_actor from pelicula
	join actor_pelicula on pelicula.id;
	
	
	count(*) as podio
			order by podio DESC;
			

select id_pelicula, titulo, competencia.nombre, genero.nombre, actor_pelicula.id as ActorID, actor.nombre as actorNombre, director_pelicula.director_id as DirID, director.nombre as directorNombre
		from voto
		join pelicula ON voto.id_pelicula = pelicula.id
		join competencia ON voto.id_competencia = competencia.id
		join genero ON pelicula.genero_id = genero.id
		join actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id
		join actor on actor.id = actor_pelicula.actor_id
		join director_pelicula ON director_pelicula.pelicula_id = pelicula.id
		join director on director_pelicula.director_id = director.id
		where voto.id_competencia = 3
		group by id_competencia, id_pelicula
		limit 1;
		
select competencia.id as competencia_id, competencia.nombre, pelicula.id as id, pelicula.titulo, pelicula.poster from pelicula join competencia where competencia.id = 8 AND pelicula.genero_id = competencia.genero_id order by rand() limit 2;

select genero_id from competencia where competencia.id = 6;
