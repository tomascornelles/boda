/* global $ google page Firebase localStorage */

new Firebase('https://boda201610.firebaseio.com/')
  .orderByChild('confirmar')
  .equalTo('Confirmado')
  .once('value', function (snap) {
    var res = snap.val()
    // console.log(snap.val())
    for (var i in res) {
      var Invitado = res[i]
      console.log(Invitado.nombre + '\n - adultos: ' + Invitado.adultos + '\n - ninos: ' + Invitado.ninos + '\n - comida: ' + Invitado.comida)
    }
  })
