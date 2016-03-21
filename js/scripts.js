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
var datos
function leerDatos (id, pass) {
  var ref = new Firebase('https://boda201610.firebaseio.com/')
  ref.child(id).on('value', function (snapshot) {
    var usuario = snapshot.val()
    if (usuario.pass === parseInt(pass)) {
      datos = {
        'nombre': usuario.nombre,
      }
    } 
    console.log(typeof (localStorage.datos))
  })
}

/* Routing */
function cleanPage () {
  $('.Page').hide()
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
function Usuario (ctx) {
  if (datos) {
    $('.Usuario-nombre').text(datos.nombre)
  } else {
    leerDatos(ctx.params.id, ctx.params.pass)
  }
  cleanPage()
  $('.Usuario').fadeIn(1000)
}
function Error404 () {
  cleanPage()
  $('.Error404').fadeIn(1000)
}

$(function () {
  $('.Home').fadeIn(1000)
  $(window).on('resize', function () {
    initMap()
  })

  page.base('/boda')
  page('/', Home)
  page('/Home', Home)
  page('/Mapa', Mapa)
  page('/Usuario', Usuario)
  page('/Usuario/:id/:pass', Usuario)
  page('*', Error404)
  page({
    hashbang: true
  })
})

