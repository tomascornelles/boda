/* global $ google page Firebase localStorage */

var resultados = $('.resultados')

function consultaConfirmados (e) {
  e.preventDefault()
  new Firebase('https://boda201610.firebaseio.com/')
  .orderByChild('confirmar')
  .equalTo('Confirmado')
  .once('value', function (snap) {
    var res = snap.val()
    // console.log(snap.val())
    resultados.empty().css({'background': 'url(../img/squares.gif) center center no-repeat', 'height': '100vh'})
    var tabla = '<table style="width:100%"><thead><tr><th>Nombre</th><th>Adultos</th><th>Niños</th><th>Comida</th></tr></thead><tbody>'
    for (var i in res) {
      var Invitado = res[i]
      var nombre = (Invitado.nombre) ? Invitado.nombre : 'Anonimo'
      var adultos = (Invitado.adultos) ? Invitado.adultos : '0'
      var ninos = (Invitado.ninos) ? Invitado.ninos : '0'
      var comida = (Invitado.comida) ? Invitado.comida : ''
      tabla += '<tr><th>' + nombre + '</th><td>' + adultos + '</td><td>' + ninos + '</td><td>' + comida + '</td></tr>'
    }
    tabla += '</tbody></table>'
    
    resultados.css({'background': '', 'height': ''}).html(tabla)
  })
}

$(function () {
  $('.confirmados').on('click', consultaConfirmados)
})
