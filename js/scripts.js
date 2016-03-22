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

function InvitadoLogin (email, pass) {
  new Firebase('https://boda201610.firebaseio.com/')
    .orderByChild('email')
    .equalTo(email)
    .once('value', function (snap) {
      if (snap.val()) {
        var res = snap.val()
        for (var i in res) {
          var Invitado = res[i]
          if (Invitado.pass === parseInt(pass)) {
            InvitadoCargar(Invitado)
          } else {
            ErrorLogin('noPass') // wrong pass
          }
        }
      } else {
        ErrorLogin('noMail') // wrong user
      }
    })
}
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
  if (!localStorage.datos) ErrorLogin() // no user
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

/* Routing */
function cleanPage () {
  $('.Page').hide()
  $('.Invitado-contenido').hide()
  $('.Invitado--cargando').show()
  $('.Login-error').hide()
}
function Home () {
  cleanPage()
  $('.Home').fadeIn(1000)
}
function Mapa () {
  cleanPage()
  $('.Mapa').fadeIn(1000)
  initMap()
}
function Invitado () {
  cleanPage()
  InvitadoMostrar()
  $('.Invitado').fadeIn(1000)
}
function Login (ctx) {
  cleanPage()
  InvitadoLogin(ctx.params.email, ctx.params.pass)
  $('.Invitado').fadeIn(1000)
}
function Logout () {
  localStorage.removeItem('datos')
  page('/home')
}
function Error404 () {
  cleanPage()
  $('.Error404').fadeIn(1000)
}
function ErrorLogin (arg) {
  cleanPage()
  if (arg) $('.Login-' + arg).fadeIn(500)
  $('.Login-form').on('submit', function (e) {
    e.preventDefault()
    page('/Invitado/' + $('.Login-email').val() + '/' + $('.Login-llave').val())
  })
  $('.Login').fadeIn(1000)
}

/* App ready to rock */
$(function () {
  $(window).on('resize', function () {
    initMap()
  })

  page.base('/boda')
  page('/', Home)
  page('/home', Home)
  page('/mapa', Mapa)
  page('/invitado', Invitado)
  page('/invitado/:email/:pass', Login)
  page('/salir', Logout)
  page('*', Error404)
  page({
    hashbang: true
  })
})

