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
      elementType: 'all',
      stylers: [
        { lightness: 100 }
      ]
    }
  ]

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles, {name: 'Styled Map'})

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var mapOptions = {
    zoom: 16,
    center: {lat: 41.3890643, lng: 2.167363},
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
    title: 'Hotel Avenida Palace',
    coords: new google.maps.LatLng(41.3890643, 2.167363),
    description: '<h4>Hotel Avenida Palace</h4><p><strong>Dirección:</strong><br>Gran Via de Les Corts Catalanes, 605, 08007 Barcelona</p><p><strong>Horario: </strong><br>Fotos: 19:00h<br>Ceremonia: 19:30h<br>Recepción: 21:00h</p>',
    icono: 'img/palace64.png'
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
function InvitadoCargar (Invitado, id) {
  var datos
  if (Invitado.admin) {
    datos = {
      'admin': true
    }
    localStorage.setItem('datos', JSON.stringify(datos))
    page('/admin')
  } else {
    datos = {
      'id': id,
      'pass': Invitado.pass,
      'nombre': Invitado.nombre,
      'email': Invitado.email,
      'adultos': Invitado.adultos,
      'ninos': Invitado.ninos,
      'comida': Invitado.comida,
      'mensaje': Invitado.mensaje,
      'confirmar': Invitado.confirmar,
      'canciones': Invitado.canciones
    }
    localStorage.setItem('datos', JSON.stringify(datos))
    page('/invitado')
  }
}
function InvitadoMostrar () {
  var datos = JSON.parse(localStorage.datos)

  if (datos['confirmar'] !== undefined) { // Ha confirmado
    if (datos['mensaje'] !== undefined) $('.button[data-destino=".Invitado-contenido-mensaje"]').hide()
    MusicaPlaylist()
  } else {
    $('.Invitado--cargando').hide()
    $('.Invitado-contenido').fadeIn()
    $('.Invitado').fadeIn(1000)
  }
}
function InvitadoGuardar (dato) {
  var datos = JSON.parse(localStorage.datos)
  var parametro = dato.attr('data-parametro')
  var valor = ''
  $('.checked[data-parametro=' + parametro + ']').each(function () {
    if (valor) valor += ', '
    valor += $(this).text()
  })
  datos[parametro] = valor
  localStorage.setItem('datos', JSON.stringify(datos))
  new Firebase('https://boda201610.firebaseio.com/')
    .child(datos.id)
    .set(datos)
}
function InvitadoMensaje () {
  var datos = JSON.parse(localStorage.datos)
  datos['mensaje'] = $('.Invitado-mensaje-texto').val()
  localStorage.setItem('datos', JSON.stringify(datos))
  new Firebase('https://boda201610.firebaseio.com/')
    .child(datos.id)
    .set(datos)
}
function InvitadoConfirmar () {
  var datos = JSON.parse(localStorage.datos)
  datos['confirmar'] = 'Confirmado'
  localStorage.setItem('datos', JSON.stringify(datos))
  new Firebase('https://boda201610.firebaseio.com/')
    .child(datos.id)
    .set(datos)
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
              InvitadoCargar(Invitado, i) // Si la llave es correcta redirige a la Página de invitado
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
  $('.checked').removeClass('checked')
  page('/home')
}
function LoginCervero (pagina) {
  if (!localStorage.datos) window.location.href = './'
  var datos = JSON.parse(localStorage.datos)
  if (pagina === 'admin' && !datos['admin']) window.location.href = './'
}

/* Musica */
function MusicaPlaylist () {
  var datos = JSON.parse(localStorage.datos)
  if (datos.canciones) {
    $('.Musica-mis-resultados').empty()
    var canciones = datos.canciones.split(', ')
    for (var i = 0; i < canciones.length; i++) {
      var url = 'https://api.spotify.com/v1/tracks/' + canciones[i]
      $.get(url, function (data) {
        var resultado = '<div class="Musica-resultado u-cf"><a data-cancion="' + data.id + '" class="Musica-resultado-remove"></a><div class="Musica-resultado-imagen"><img src="' + data.album.images[0].url + '" alt=""></div><h4 class="Musica-resultado-nombre">' + data.name + '</h4><div class="Musica-resultado-artista">' + data.artists[0].name + '</div><div class="Musica-resultado-album">' + data.album.name + '</div></div>'
        $('.Musica-mis-resultados').append(resultado)
        $('.Musica-resultado-add').on('click', MusicaGuardar)
        $('.Musica-resultado-remove').on('click', MusicaBorrar)
      })
    }
  } else {
    $('.Musica-mis-resultados').html('<h3>¿Nos ayudas con la música de la fiesta?</h3><p>¡Sugierenos las canciones que más te gusten!</p>')
  }
  $('.Musica').fadeIn(1000)
}
function MusicaBuscar () {
  var url = 'https://api.spotify.com/v1/search?query=' + $(this).val() + '&offset=0&limit=20&type=track'
  $.get(url, function (data) {
    $('.Musica-resultados').empty()
    for (var i = 0; i < data.tracks.items.length; i++) {
      var item = data.tracks.items[i]
      var datos = JSON.parse(localStorage.datos)
      var clase = 'Musica-resultado-add'
      if (datos.canciones) {
        if (datos.canciones.indexOf(item.id) !== -1) {
          clase = 'Musica-resultado-remove'
        }
      }
      var resultado = '<div class="Musica-resultado u-cf"><a data-cancion="' + item.id + '" class="' + clase + '"></a><div class="Musica-resultado-imagen"><img src="' + item.album.images[0].url + '" alt=""></div><h4 class="Musica-resultado-nombre">' + item.name + '</h4><div class="Musica-resultado-artista">' + item.artists[0].name + '</div><div class="Musica-resultado-album">' + item.album.name + '</div></div>'
      $('.Musica-resultados').append(resultado)
    }
    $('.Musica-resultado-add').on('click', MusicaGuardar)
    $('.Musica-resultado-remove').on('click', MusicaBorrar)
  })
}
function MusicaGuardar () {
  var datos = JSON.parse(localStorage.datos)
  var parametro = 'canciones'
  var valor = $(this).attr('data-cancion')
  $(this).addClass('Musica-resultado-remove').removeClass('Musica-resultado-add')
  if (datos[parametro]) {
    datos[parametro] += ', ' + valor
  } else {
    datos[parametro] = valor
  }
  $('.Musica-volver').slideDown()
  localStorage.setItem('datos', JSON.stringify(datos))
  new Firebase('https://boda201610.firebaseio.com/')
    .child(datos.id)
    .set(datos)
  $('.Musica-resultado-remove').on('click', MusicaBorrar)
}
function MusicaBorrar () {
  var datos = JSON.parse(localStorage.datos)
  var parametro = 'canciones'
  var valor = $(this).attr('data-cancion')
  // $(this).closest('.Musica-resultado').remove()
  $(this).addClass('Musica-resultado-add').removeClass('Musica-resultado-remove')
  var canciones = datos.canciones.split(', ')
  datos[parametro] = ''
  for (var i = 0; i < canciones.length; i++) {
    if (datos[parametro] && canciones[i] !== valor) {
      datos[parametro] += ', ' + canciones[i]
    } else if (canciones[i] !== valor) {
      datos[parametro] = canciones[i]
    }
  }

  localStorage.setItem('datos', JSON.stringify(datos))
  new Firebase('https://boda201610.firebaseio.com/')
    .child(datos.id)
    .set(datos)
  $('.Musica-resultado-add').on('click', MusicaGuardar)
}

/* Admin */
function AdminListar (ctx) {
  var consulta = ctx.params.consulta

  if (consulta === 'confirmados') {}
  new Firebase('https://boda201610.firebaseio.com/')
    .orderByChild('confirmar')
    .equalTo('Confirmado')
    .once('value', function (snap) {
      if (snap.val()) {
        var res = snap.val()
        for (var i in res) {
          var Invitado = res[i]
          AdminMostrarInvitado(Invitado)
        }
      } else {
        $('.Admin .mensajes').append('No hay resultados')
      }
    })
  $('.Admin').fadeIn(1000)
}
function AdminMostrar (ctx) {
  console.log(ctx.params.consulta)
}
function AdminMostrarInvitado (Invitado) {
  var cadena = ''
  if (Invitado.adultos) cadena += Invitado.adultos + ' Adultos'
  if (Invitado.adultos && Invitado.ninos) cadena += ' y '
  if (Invitado.ninos) cadena += Invitado.ninos + ' Niños'
  $('.Admin-listado').append('<li><strong>' + Invitado.nombre + ': </strong>' + cadena + '</li>')
}

/* Chara */
function CharaMaker () {
  var colores = ['#fec', '#fec', '#fec', '#fec', '#fec']
  // var colores = ['#fec', '#321', '#333', '#c00', '#039']
  $('.svg-body').css({'fill': colores[0]})
  $('.svg-hair').css({'fill': colores[1]})
  $('.svg-eyes').css({'fill': colores[2]})
  $('.svg-shirt').css({'fill': colores[3]})
  $('.svg-pants').css({'fill': colores[4]})
}

/* Utilidades */
function toggleDestino () {
  $($(this).attr('data-destino')).siblings('.Page-section').slideUp(400)
  $($(this).attr('data-destino')).slideDown(400)
}
function toggleButton () {
  if ($(this).hasClass('checked')) $(this).removeClass('checked')
  else $(this).addClass('checked').siblings('.button-radio').removeClass('checked')
  InvitadoGuardar($(this))
}
function checkButton () {
  $(this).toggleClass('checked')
  InvitadoGuardar($(this))
}

/* Routing */
function PaginaLimpia () {
  $('.Page').hide()
  $('.Page-section').hide()
  $('.error').hide()
  $('.Musica-resultados').empty()
  $('.Musica-input').val('')
  $('.Menu .u-desktop').css({'display': ''})

  $('.Menu a').show()
  if (!localStorage.datos) $('.cervero').hide()

  $('.Invitado--cargando').show()
  $('.Invitado-contenido-botones').show()
}
function PaginaHome () {
  PaginaLimpia()
  $('.Home').fadeIn(1000)
}
function PaginaChara () {
  PaginaLimpia()
  CharaMaker()
  $('.Chara').fadeIn(1000)
}
function PaginaMapa () {
  LoginCervero()
  PaginaLimpia()
  $('.Mapa').fadeIn(1000)
  initMap()
}
function PaginaInvitado () {
  LoginCervero()
  PaginaLimpia()
  InvitadoMostrar()
}
function PaginaLogin () {
  PaginaLimpia()
  $('.Login').fadeIn(1000)
}
function PaginaMusica () {
  LoginCervero()
  PaginaLimpia()
  MusicaPlaylist()
}
function PaginaMusicaBuscar () {
  LoginCervero()
  PaginaLimpia()
  $('.Musica-Buscar').fadeIn(1000)
}
function PaginaAdmin () {
  LoginCervero('admin')
  PaginaLimpia()
  $('.Admin').fadeIn(1000)
}
function PaginaAdminListar () {
  LoginCervero('admin')
  PaginaLimpia()
  AdminListar()
  $('.Admin').fadeIn(1000)
}
function PaginaAdminMostrar () {
  LoginCervero('admin')
  PaginaLimpia()
  AdminMostrar()
  $('.Admin').fadeIn(1000)
}
function Pagina404 () {
  PaginaLimpia()
  $('.Error404').fadeIn(1000)
}

/* App ready to rock */
$(function () {
  $(window).on('resize', function () {
    initMap()
    $('.Menu .u-desktop').css({'display': ''})
  })

  $('.Menu-toggle').on('click', function () {
    $('.Menu .u-desktop').slideToggle()
  })

  $('.button-submit').on('click', toggleDestino)
  $('.button-radio').on('click', toggleButton)
  $('.button-check').on('click', checkButton)
  $('.Invitado-mensaje-enviar').on('click', InvitadoMensaje)
  $('.Invitado-confirmar-enviar').on('click', InvitadoConfirmar)
  $('.Musica-input').on('keyup', MusicaBuscar)

  page.base('/boda')
  page('/', PaginaHome)
  page('/home', PaginaHome)
  page('/dibuja', PaginaChara)
  page('/mapa', PaginaMapa)
  page('/invitado', Login)
  page('/invitado/:pass', Login)
  page('/salir', Logout)
  page('/musica', PaginaMusica)
  page('/buscarmusica', PaginaMusicaBuscar)
  page('/admin', PaginaAdmin)
  page('/admin/listar/:consulta', AdminListar)
  page('/admin/mostrar/:consulta', AdminMostrar)
  page('/*', Pagina404)
  page({
    hashbang: true
  })
})

