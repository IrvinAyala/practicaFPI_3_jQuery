////ID
var idLiga;
var idEquipo;

//Estos son para los JSON
var JSONLigas;
var JSONEquipos;
var JOSNJugadores;

//Array para las listas de ligas y id
var listComplete = new Array();
var listComplete2 = new Array();

//Array para los equipos y los id
var listComplete3 = new Array();
var listComplete4 = new Array();


function LlenarConEnterLigas(e) {
    if (e.keyCode == 13) {

        e.preventDefault();
        captarIdLigas(e);
    }
}

function captarIdLigas(e) {

    var ligaSeleccionada = $(".ligas").val();
    console.log(ligaSeleccionada);
    var posicionLiga = listComplete.indexOf(ligaSeleccionada);
    idLiga = parseInt(listComplete2[posicionLiga]);
    console.log(idLiga);

    e.preventDefault();
    limpiar();
    cargarEquipos();
}

function cargarEquipos() {

    document.getElementById("equipos").removeAttribute("disabled");

    $.ajax({
        headers: {'X-Auth-Token': 'df40f3f9eb674bc5acf47bf88f22345c'},
        url: 'http://api.football-data.org/v1/competitions/' + idLiga + '/teams',
        dataType: 'json',
        type: 'GET',
    }).done(function (response) {
        console.log(response);

        //para el autocompletado
        for (i = 0; i < response.teams.length; i++) {
            listComplete3[i] = String(response.teams[i].name);
            listComplete4[i] = String(response.teams[i]._links.players.href.slice(38, -8));
        }
        console.log(listComplete3);
        creadorAutocompleteEquipos(listComplete3, listComplete4);
    });
}


function LlenarConEnterEquipos(e) {
    if (e.keyCode == 13) {

        e.preventDefault();
        captarIdEquipos(e);
    }
}

function captarIdEquipos(e) {

    var equipoSeleccionado = $(".equipos").val();
    console.log(equipoSeleccionado);
    var posicionEquipo = listComplete3.indexOf(equipoSeleccionado);

    idEquipo = parseInt(listComplete4[posicionEquipo]);
    console.log(idEquipo);

    e.preventDefault();
    cargarJugadores();
}


function cargarJugadores() {
    $.ajax({
        headers: {'X-Auth-Token': 'df40f3f9eb674bc5acf47bf88f22345c'},
        url: 'http://api.football-data.org/v1/teams/' + idEquipo + '/players',
        dataType: 'json',
        type: 'GET',
    }).done(function (response) {
        console.log(response);
        mostrar(response);
    });
}


function mostrar(JSON) {

    $(".contenedor-jugadores").html("");

    if (JSON.players[0] != null && JSON.players[0] != "undefined") {
        for (i = 0; i < JSON.players.length; i++) {

            var contenido = `<div class="jugadores">
                        <label class="titulos">Nombre: </label><label>${JSON.players[i].name}</label><br>
                        <label class="titulos">Posicion: </label><label>${JSON.players[i].position}</label><br>
                        <label class="titulos">Numero: </label><label>${JSON.players[i].jerseyNumber}</label><br>
                        <label class="titulos">Fecha de nacimiento: </label><label>${JSON.players[i].dateOfBirth}</label><br>
                        <label class="titulos">Nacionalidad: </label><label>${JSON.players[i].nationality}</label><br>
                        <label class="titulos">Contrato: </label><label>${JSON.players[i].contractUntil}</label><br>
                        <label class="titulos">Nacionalidad: </label><label>${JSON.players[i].nationality}</label><br>
                    </div>`;

            var node = document.createElement("div");
            node.innerHTML = contenido;
            $(".contenedor-jugadores").append(node);
        }
    } else {
        $(".contenedor-jugadores").html("<p id=\"noJugadores\">No se encontraron jugadores</p>");
    }
}

function limpiar() {
    $(".contenedor-jugadores").html("");
    $(".equipos").val("");
    $("#lista2").html("");
}


//Para el autocompletado
window.onload = function () {

    document.getElementById("equipos").setAttribute("disabled", null);

    $.ajax({
        headers: {'X-Auth-Token': 'df40f3f9eb674bc5acf47bf88f22345c'},
        url: 'http://api.football-data.org/v1/competitions/',
        dataType: 'json',
        type: 'GET',
    }).done(function (response) {
        console.log(response);
        for (i = 0; i < response.length; i++) {
            listComplete[i] = String(response[i].caption);
            listComplete2[i] = String(response[i].id);
        }
        console.log(listComplete);
        console.log(listComplete2);
        creadorAutocompleteLigas(listComplete, listComplete2);
    });
}

function creadorAutocompleteLigas(listComplete, listComplete2) {
    for (i = 0; i < listComplete2.length; i++) {
        var node = document.createElement("OPTION");
        var textnode = document.createTextNode(listComplete[i]);
        node.appendChild(textnode);
        node.setAttribute("id", listComplete2[i]);
        node.setAttribute("caption", listComplete[i]);
        $("#lista").append(node);
    }
}

function creadorAutocompleteEquipos(listComplete, listComplete2) {
    for (i = 0; i < listComplete2.length; i++) {
        var node = document.createElement("OPTION");
        var textnode = document.createTextNode(listComplete[i]);
        node.appendChild(textnode);
        node.setAttribute("id", listComplete2[i]);
        node.setAttribute("name", listComplete[i]);
        $("#lista2").append(node);
    }
}
