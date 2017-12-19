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

update competencia set actor_id = 0;

select pelicula.titulo, pelicula.director from pelicula where pelicula.director = "Aaron Blaise";


////////;

select actor.id as ActorId, actor.nombre, pelicula.titulo, genero.nombre, director.nombre as DirName from actor
	join actor_pelicula on actor_pelicula.actor_id = actor.id
	join pelicula on actor_pelicula.pelicula_id = pelicula.id
	join director_pelicula on director_pelicula.pelicula_id = pelicula.id
	join director on director_pelicula.director_id = director.id
	join genero on pelicula.genero_id = genero.id
	where pelicula.id = 171 AND actor.id = 1957 AND director.id = 3364;
	limit 500;
	
///////////////////;
CHECKEANDO SI HAY ALGUN MATCH ENTRE GENERO-DIRECTOR-ACTOR, PARA PODER CREAR O NO QUERIES CON TODOS LOS PARAMS;

select actor.id as ActorId, actor.nombre, pelicula.titulo, genero.nombre, director.nombre as DirName from actor
	join actor_pelicula on actor_pelicula.actor_id = actor.id
	join pelicula on actor_pelicula.pelicula_id = pelicula.id
	join director_pelicula on director_pelicula.pelicula_id = pelicula.id
	join director on director_pelicula.director_id = director.id
	join genero on pelicula.genero_id = genero.id
	where genero.id = 5 AND actor.id = 1957 AND director.id = 3364;

///////////////////;

select count(*) as existe from actor
		join actor_pelicula on actor_pelicula.actor_id = actor.id
		join pelicula on actor_pelicula.pelicula_id = pelicula.id
		join director_pelicula on director_pelicula.pelicula_id = pelicula.id
		join director on director_pelicula.director_id = director.id
		join genero on pelicula.genero_id = genero.id
		where genero.id = 5 AND actor.id = 1957 AND director.id = 3364;

select pelicula.titulo, pelicula.director, actor.nombre as ActorNombre, genero.nombre as GeneroNombre from pelicula
	join actor_pelicula on actor_pelicula.pelicula_id where ac
	join actor on actor_pelicula.actor_id = actor.id
	join genero on genero.id = pelicula.genero_id
	limit 1000;
	
update competencia set activa = 0 where id=24;
/////////////////////////;

select id_pelicula, competencia.nombre as comp_nombre, genero.nombre as genero, actor.nombre as actorNombre, director.nombre as directorNombre  
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
		limit 5;
///////////////;

////// PARA COMPETENCIAS DETALLES.. TODAVIA NO FUNCA
select competencia.id as compId, competencia.nombre, pelicula.id as PeliId, pelicula.titulo, pelicula.poster, director.nombre, genero.nombre as GeneroNombre
	from competencia
	join pelicula on pelicula.id 
	
	join genero on genero.id = competencia.genero_id
	
	join actor_pelicula on actor_pelicula.actor_id = competencia.actor_id
	join actor on actor.id = actor_pelicula.actor_id
	join director_pelicula on director_pelicula.director_id = competencia.director_id
	join director on director.id = director_pelicula.director_id
	
	where genero.id = 7 AND director.id = 3364
	order by rand()
	limit 10;
	
	
	
/////////////////;



select competencia.id as comp_Id, competencia.nombre, pelicula.id as Peli_Id, pelicula.titulo, pelicula.poster
	from competencia
	join pelicula
	-- left join genero on genero.id = competencia.genero_id
	left join director on director.id = competencia.director_id
	where competencia.id = 22 and pelicula.genero_id = 10
	-- order by rand()
	limit 10;
	
////////////////;
	join director on director.id = competencia.director_id

	where competencia.id = 18 AND pelicula.genero_id = competencia.genero_id order by rand() limit 2

////////////////;




-- SELECT ac.actor_id, p.* from pelicula p
SELECT di.director_id, p.* from pelicula p

	right join genero g on p.genero_id = 2
	-- right join actor_pelicula ac on ac.actor_id = 1
	right join director_pelicula di on di.director_id = ;
	-- WHERE p.id is not null group by p.id;

////;
select distinct(p.id), p.titulo, p.poster from pelicula p
	left join actor_pelicula ap on ap.pelicula_id = p.id
	left join director_pelicula dp on dp.pelicula_id = p.id
	-- where ap.actor_id = 0 AND dp.director_id = 3364 and p.genero_id = 0
	-- where dp.director_id = 3364 and p.genero_id = 2
	where p.genero_id = 5
	-- where dp.director_id = 3364
	-- where 1=1
	order by rand()
	limit 2;

////////////////////////;


select competencia.genero_id, competencia.director_id, competencia.actor_id from competencia where competencia.id = 18;


/////////////////;

-- select competencia.nombre, genero.nombre as GenreName, actor.nombre as ActorName, director.nombre as DirName
select competencia.nombre as competenciaName, genero.nombre as generoName, director.nombre as directorName, actor.nombre as actorName
	from competencia
	-- join genero on competencia.genero_id = genero.id
	-- join actor on actor.id = competencia.actor_id
	-- join director on director.id = competencia.director_id
	where competencia.id = 18
	limit 100;

////////////////////;

select competencia.nombre as competenciaName from competencia where competencia.id = 1 group by id_competencia, id_pelicula limit 1;

//////////;

select id_pelicula, competencia.nombre as comp_nombre, genero.nombre as genero, actor.nombre as actorNombre, director.nombre as directorNombre  
		from voto
		join pelicula ON voto.id_pelicula = pelicula.id
		join competencia ON voto.id_competencia = competencia.id
		join genero ON pelicula.genero_id = genero.id
		left join actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id
		left join actor on actor.id = actor_pelicula.actor_id
		left join director_pelicula ON director_pelicula.pelicula_id = pelicula.id
		left join director on director_pelicula.director_id = director.id
		where voto.id_competencia = 5
		group by id_competencia, id_pelicula
		limit 1;