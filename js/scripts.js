/* global $ google page Firebase localStorage */

function initMap () {
  // Create an array of styles.
  var styles = [
    {
      stylers: [
        { hue: '#F39C12' },
        { saturation: 20 }
      ]
    }, {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        { lightness: 100 }
      ]
    }, {
      featureType: 'road',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ]

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles, {name: 'Styled Map'})

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var mapOptions = {
    zoom: 13,
    center: {lat: 41.4364338, lng: 2.1518140},
    // center: {lat: 41.4382338, lng: 2.1203029},

    scrollwheel: false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    },
    disableDefaultUI: true
  }
  var map = new google.maps.Map(document.getElementById('map'),
    mapOptions)

  map.mapTypes.set('map_style', styledMap)
  map.setMapTypeId('map_style')

  // Lugares
  var can = {
    title: 'Can Cortada',
    coords: new google.maps.LatLng(41.4364338, 2.1518140),
    description: '<p><strong>Can Cortada</strong></p>' + '<p><strong>Hora: </strong> 14:00h</p>',
    icono: 'img/can32.png'
  }
  var canWindow = new google.maps.InfoWindow({
    content: can.description
  })
  var canMarker = new google.maps.Marker({
    position: can.coords,
    map: map,
    title: can.title,
    icon: can.icono
  })
  canMarker.addListener('click', function () {
    canWindow.open(map, canMarker)
  })
}

/* Invitado */
function InvitadoCargar (Invitado) {
  var datos = {
    'nombre': Invitado.nombre,
    'email': Invitado.email,
    'adultos': Invitado.adultos,
    'ninos': Invitado.ninos,
    'comida': Invitado.comida
  }
  localStorage.setItem('datos', JSON.stringify(datos))
  page('/invitado')
}
function InvitadoMostrar () {
  var datos = JSON.parse(localStorage.datos)
  for (var dato in datos) {
    if (datos[dato]) {
      if (dato === 'nombre') {
        $('.Invitado-' + dato).text(datos[dato])
      } else {
        $('.Invitado-' + dato).val(datos[dato]).closest('.Invitado-datos').show()
      }
    }
  }
  $('.Invitado--cargando').hide()
  $('.Invitado-contenido').fadeIn()
}
function toggleDestino () {
  console.log($(this).attr('data-destino'));
  $($(this).attr('data-destino')).siblings('.Page-section').slideUp(400)
  $($(this).attr('data-destino')).slideDown(400)
}
function toggleButton() {
  if ($(this).hasClass('checked')) $(this).removeClass('checked')
  else $(this).addClass('checked').siblings('.button-radio').removeClass('checked')
}
function checkButton() {
  $(this).toggleClass('checked')
}

/* Login */
function Login (ctx) {
  var pass = ctx.params.pass
  $('.Login-form').on('submit', function (e) {
    e.preventDefault()
    page('/invitado/' + $('.Login-llave').val())
  })
  if (pass) { // Entra un llave o error por URL
    if (pass === 'error') { // El login no es correcto
      PaginaLogin()
      $('.Login-noPass').fadeIn(500) // Muestra mensaje
    } else { // El parámetro es una llave
      pass = parseInt(pass)
      localStorage.removeItem('datos') // Primero salimos de la sesion anterior
      new Firebase('https://boda201610.firebaseio.com/')
        .orderByChild('pass')
        .equalTo(pass)
        .once('value', function (snap) {
          if (snap.val()) {
            var res = snap.val()
            for (var i in res) {
              var Invitado = res[i]
              InvitadoCargar(Invitado) // Si la llave es correcta redirige a la Página de invitado
            }
          } else {
            page('/invitado/error') // Si la llave no es correcta devuelve al login y muestra el mensaje de error
          }
        })
    }
  } else if (localStorage.datos) { // Ya está definido el usuario
    PaginaInvitado() // Muestra la página de invitado
  } else {
    PaginaLogin()
  }
}
function Logout () {
  localStorage.removeItem('datos')
  page('/home')
}

/* Routing */
function PaginaLimpia () {
  $('.Page').hide()
  $('.Page-section').hide()
  $('.error').hide()

  $('.Invitado--cargando').show()
  $('.Invitado-contenido-botones').show()
}
function PaginaHome () {
  PaginaLimpia()
  $('.Home').fadeIn(1000)
}
function PaginaMapa () {
  PaginaLimpia()
  $('.Mapa').fadeIn(1000)
  initMap()
}
function PaginaInvitado () {
  PaginaLimpia()
  InvitadoMostrar()
  $('.Invitado').fadeIn(1000)
}
function PaginaLogin () {
  PaginaLimpia()
  $('.Login').fadeIn(1000)
}
function Pagina404 () {
  PaginaLimpia()
  $('.Error404').fadeIn(1000)
}

/* App ready to rock */
$(function () {
  $(window).on('resize', function () {
    initMap()
  })

  $('.button-submit').on('click', toggleDestino)
  $('.button-radio').on('click', toggleButton)
  $('.button-check').on('click', checkButton)

  page.base('/boda')
  page('/', PaginaHome)
  page('/home', PaginaHome)
  page('/mapa', PaginaMapa)
  page('/invitado', Login)
  page('/invitado/:pass', Login)
  page('/entrar', Login)
  page('/salir', Logout)
  page('*', Pagina404)
  page({
    hashbang: true
  })
})

