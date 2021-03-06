/* global $ Firebase */

var resultados = $('.resultados')

function consultaConfirmados(e) {
    e.preventDefault()
    new Firebase('https://boda201702.firebaseio.com/')
        .orderByChild('confirmar')
        .equalTo('Confirmado')
        .once('value', function(snap) {
            var res = snap.val()
                // console.log(snap.val())
            resultados.empty().css({ 'background': 'url(../img/squares.gif) center center no-repeat', 'height': '100vh' })
            var tabla = '<table><thead><tr><th>Nombre</th><th>Adultos</th><th>Comida</th></tr></thead><tbody>'
            var totales = {
                adultos: 0,
                ninos: 0
            }
            for (var i in res) {
                var Invitado = res[i]
                var nombre = (Invitado.nombre) ? Invitado.nombre : 'Anonimo'
                var adultos = (Invitado.adultos) ? Invitado.adultos : 0
                totales.adultos += parseInt(adultos)
                var ninos = (Invitado.ninos) ? Invitado.ninos : 0
                totales.ninos += parseInt(ninos)
                var comida = (Invitado.comida) ? Invitado.comida : ''
                tabla += '<tr><th>' + nombre + '</th><td>' + adultos + '</td><td>' + comida + '</td></tr>'
            }
            tabla += '<tr><th>Total</th><th>' + totales.adultos + '</th><td></td></tr>'
            tabla += '</tbody></table>'

            resultados.css({ 'background': '', 'height': '' }).html(tabla)
        })
}

function consultaMensajes(e) {
    e.preventDefault()
    new Firebase('https://boda201702.firebaseio.com/')
        .orderByChild('mensaje')
        .once('value', function(snap) {
            var res = snap.val()
                // console.log(snap.val())
            resultados.empty().css({ 'background': 'url(../img/squares.gif) center center no-repeat', 'height': '100vh' })
            var tabla = '<table><thead><tr><th>Nombre</th><th>Mensaje</th></tr></thead><tbody>'
            for (var i in res) {
                var Invitado = res[i]
                if (Invitado.mensaje) {
                    var nombre = (Invitado.nombre) ? Invitado.nombre : 'Anonimo'
                    var mensaje = Invitado.mensaje.replace('\n', '<br>')
                    tabla += '<tr><th>' + nombre + '</th><td>' + mensaje + '</td></tr>'
                }
            }
            tabla += '</tbody></table>'

            resultados.css({ 'background': '', 'height': '' }).html(tabla)
        })
}

function consultaPixelitos(e) {
    e.preventDefault()
    new Firebase('https://boda201702.firebaseio.com/')
        .orderByChild('chara')
        .once('value', function(snap) {
            var res = snap.val()
                // console.log(snap.val())
            resultados.empty().css({ 'background': 'url(../img/squares.gif) center center no-repeat', 'height': '100vh' })
            var tabla = '<table><thead><tr><th>Nombre</th><th style="width:256px">Pixelito</th></tr></thead><tbody>'
            for (var i in res) {
                var Invitado = res[i]
                if (Invitado.chara) {
                    var nombre = (Invitado.nombre) ? Invitado.nombre : 'Anonimo'
                    var chara = CharaMaker(Invitado.chara)
                    tabla += '<tr><th>' + nombre + '</th><td><svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 17 17">' + chara + '</svg></td></tr>'
                }
            }
            tabla += '</tbody></table>'

            resultados.css({ 'background': '', 'height': '' }).html(tabla)
        })
}
/* Chara */
function CharaMaker(chara) {
    var miSVG = $('#my-svg').clone()
    miSVG.find('.svg_body').css({ 'fill': chara.svg_body })
    miSVG.find('.svg_hair').css({ 'fill': chara.svg_hair }).hide()
    if (chara.hairType === 'corto') {
        miSVG.find('.svg_hair_corto').show()
    } else {
        miSVG.find('.svg_hair_largo').show()
    }
    miSVG.find('.svg_beard').css({ 'fill': chara.svg_beard })
    miSVG.find('.svg_mustache').css({ 'fill': chara.svg_mustache })
    miSVG.find('.svg_eyes').css({ 'fill': chara.svg_eyes })
    miSVG.find('.svg_shirt').css({ 'fill': chara.svg_shirt }).hide()
    miSVG.find('.svg_shirt_corto').show()
    miSVG.find('.svg_shirt_chaleco').css({ 'fill': chara.svg_shirt_chaleco })
    miSVG.find('.svg_shirt_tirantes').css({ 'fill': chara.svg_shirt_tirantes })
    miSVG.find('.svg_shirt_rayas').css({ 'fill': chara.svg_shirt_rayas })
    miSVG.find('.svg_shirt_flash').css({ 'fill': chara.svg_shirt_flash })
    miSVG.find('.svg_pants').css({ 'fill': chara.svg_pants }).hide()
    if (chara.pantType === 'falda') {
        miSVG.find('.svg_pants_falda').show()
    } else if (chara.pantType === 'corto') {
        miSVG.find('.svg_pants_corto').show()
    } else {
        miSVG.find('.svg_pants_largo').show()
    }
    miSVG.find('.svg_shoes').css({ 'fill': chara.svg_shoes })

    return miSVG.html()
}

$(function() {
    $('.confirmados').on('click', consultaConfirmados)
    $('.mensajes').on('click', consultaMensajes)
    $('.pixelitos').on('click', consultaPixelitos)

    $('.Menu-toggle').on('click', function() {
        $('.Menu .u-desktop').slideToggle()
    })
})