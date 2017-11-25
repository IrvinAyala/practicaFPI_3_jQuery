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
//    location.href = "practica_3.html?id=" + idLiga;

//  $("#contenedorModal").className = "mostrar";
//    $(".contenedor-jugadores").attr("display", "block");

//    e.preventDefault();
    limpiar();
    cargarEquipos();
}

function cargarEquipos() {
    $.ajax({
        headers: {'X-Auth-Token': 'df40f3f9eb674bc5acf47bf88f22345c'},
        url: 'http://api.football-data.org/v1/competitions/' + idLiga + '/teams',
        dataType: 'json',
        type: 'GET',
    }).done(function (response) {
        console.log(response);
//        cargarEquipos(response.id);

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

    $(".equipos").removeAttr("disabled");

//    $("#lista2").html("");

    var equipoSeleccionado = $(".equipos").val();
    console.log(equipoSeleccionado);
    var posicionEquipo = listComplete3.indexOf(equipoSeleccionado);

    idEquipo = parseInt(listComplete4[posicionEquipo]);
    console.log(idEquipo);
//    location.href = "practica_3.html?id=" + idLiga;

//  $("#contenedorModal").className = "mostrar";
    $(".contenedor-jugadores").attr("display", "block");

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
    if (JSON.players[0] != null && JSON.players[0] != "undefined") {
        for (i = 0; i < JSON.players.length; i++) {

            var contenido = `<div class="jugadores">
                        <label>Nombre: </label><label>${JSON.players[i].name}</label><br>
                        <label>Posicion: </label><label>${JSON.players[i].position}</label><br>
                        <label>Numero: </label><label>${JSON.players[i].jerseyNumber}</label><br>
                        <label>Fecha de nacimiento: </label><label>${JSON.players[i].dateOfBirth}</label><br>
                        <label>Nacionalidad: </label><label>${JSON.players[i].nationality}</label><br>
                        <label>Contrato: </label><label>${JSON.players[i].contractUntil}</label><br>
                        <label>Nacionalidad: </label><label>${JSON.players[i].nationality}</label><br>
                    </div><br><br>`;

            var node = document.createElement("div");
            node.innerHTML = contenido;
//            node.appendChild(node);
            $(".contenedor-jugadores").append(node);
        }
//    $("#contenedorModal").className = "ocultar";
    } else {
        $(".contenedor-jugadores").html("No se encontraron jugadores");
    }

}

function limpiar() {
    $(".contenedor-jugadores").html("");
    $(".contenedor-jugadores").attr("display", "none");
    $(".equipos").attr("disabled");
    $("#lista2").html("");
    //LIMPIAR LA LISTA DE EQUIPOS Y DESABILITARLA
}


//Para las habilidades, movimientos y typos
function generarElemento(identificador, texto, elemento, formato) {
    var elemento = document.createElement(elemento);
    var textoElemento = document.createTextNode(texto);
    elemento.appendChild(textoElemento);
    elemento.className = formato;
    $(identificador).appendChild(elemento);
}


//Para el autocompletado
window.onload = function () {

    $(".equipos").attr("disabled");

//    idLiga = parseFloat(location.href.split("=")[1]);
//    if (idLiga > 0) {
//
//        cargarEquipos();
//    }

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

