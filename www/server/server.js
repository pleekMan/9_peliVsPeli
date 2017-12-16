var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controller = require('./controller.js');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/competencias/:id/peliculas", controller.getParaVotar);
app.post("/competencias/:idCompetencia/voto", controller.votar);
app.get("/competencias/:idCompetencia/resultados", controller.getResultados);
app.get("/competencias", controller.getCompetencias);
app.get("/competencias/:id", controller.getDatosDeCompetencia);
app.post("/competencias", controller.crearCompetencia);
app.delete("/competencias/:idCompetencia/votos", controller.reiniciarCompetencia)


//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';


app.listen(puerto, function () {
  console.log( "-|| Escuchando en el puerto: " + puerto + "\n-||============" );
});