/* global $ google page Firebase localStorage location */

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
    description: '<h4>Hotel Avenida Palace</h4><p><strong>Dirección:</strong><br>Gran Via de Les Corts Catalanes, 605, 08007 Barcelona</p><p><strong>Horario: </strong><br>Fotos: 19:00h<br>Ceremonia: 19:30h<br>Recepción: 21:00h</p><p><a href="https://www.google.es/maps/dir//Hotel+Avenida+Palace,+Gran+Via+de+Les+Corts+Catalanes,+605,+08007+Barcelona/@41.3890643,2.1651743,17z/data=!4m13!1m4!3m3!1s0x12a4a2f257ed123f:0xd0526acc9f673041!2sHotel+Avenida+Palace!3b1!4m7!1m0!1m5!1m1!1s0x12a4a2f257ed123f:0xd0526acc9f673041!2m2!1d2.167363!2d41.3890643" target="_blank" class="button u-full-width">¿Como llegar?</a></p>',
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
      'canciones': Invitado.canciones,
      'chara': Invitado.chara
    }
    localStorage.setItem('datos', JSON.stringify(datos))
    // page('/invitado')
    page('/home')
  }
}
function InvitadoMostrar () {
  var datos = JSON.parse(localStorage.datos)
  $('.Invitado-nombre').text(datos['nombre'])
  if (datos['confirmar'] !== undefined) { // Ha confirmado
    $('.Invitado-noConfirma').hide()
    $('.Invitado-confirmado').show()
    if (datos['mensaje'] !== undefined) {
      $('.button[data-destino=".Invitado-contenido-mensaje"]').hide()
    } else {
      $('.button[data-destino=".Invitado-contenido-mensaje"]').closest('.six').removeClass('six').addClass('twelve')
    }
    $('.Invitado--cargando').hide()
    $('.Invitado-contenido').fadeIn()
    $('.Invitado').fadeIn(1000)
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
        var resultado = '<div class="Musica-resultado u-cf"><a data-cancion="' + data.id + '" class="Musica-resultado-remove"></a><div class="Musica-resultado-imagen"><img src="' + data.album.images[0].url + '" alt=""></div><h4 class="Musica-resultado-nombre">' + data.name + ' <a href="' + data.preview_url + '" target="_blank" style="text-decoration: none;">▶</a></h4><div class="Musica-resultado-artista">' + data.artists[0].name + '</div><div class="Musica-resultado-album">' + data.album.name + '</div></div>'
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
      var resultado = '<div class="Musica-resultado u-cf"><a data-cancion="' + item.id + '" class="' + clase + '"></a><div class="Musica-resultado-imagen"><img src="' + item.album.images[0].url + '" alt=""></div><h4 class="Musica-resultado-nombre">' + item.name + ' <a href="' + item.preview_url + '" target="_blank" style="text-decoration: none;">▶</a></h4><div class="Musica-resultado-artista">' + item.artists[0].name + '</div><div class="Musica-resultado-album">' + item.album.name + '</div></div>'
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

/* Chara */
function CharaMaker () {
  var colores = ['#efbe92', '#402420', '#000000', '#c22b2a', '#004584', '#402420']
  var chara = {
    'svg_body': colores[0],
    'svg_hair': colores[1],
    'svg_beard': 'transparent',
    'svg_mustache': 'transparent',
    'svg_eyes': colores[2],
    'svg_shirt': colores[3],
    'svg_pants': colores[4],
    'svg_shoes': colores[5],
    'svg_shirt_chaleco': 'transparent',
    'svg_shirt_tirantes': 'transparent',
    'svg_shirt_rayas': 'transparent',
    'svg_shirt_flash': 'transparent',
    'hairType': 'corto',
    'shirtType': 'corto',
    'pantType': 'largo'
  }
  if (localStorage.datos) {
    var datos = JSON.parse(localStorage.datos)
    console.log(datos.chara)
    if (datos['chara']) {
      chara = datos.chara
    } else {
      datos['chara'] = chara
    }
  }

  $('.svg_body').css({'fill': chara.svg_body})
  $('.svg_hair').css({'fill': chara.svg_hair}).hide()
  if (chara.hairType === 'corto') {
    $('.svg_hair_corto').show()
  } else {
    $('.svg_hair_largo').show()
  }
  $('.svg_beard').css({'fill': chara.svg_beard})
  $('.svg_mustache').css({'fill': chara.svg_mustache})
  $('.svg_eyes').css({'fill': chara.svg_eyes})
  $('.svg_shirt').css({'fill': chara.svg_shirt}).hide()
<<<<<<< HEAD
=======
  if (chara.shirtType === 'corto') {
    $('.svg_shirt_corto').show()
  } else if (chara.shirtType === 'largo') {
    $('.svg_shirt_largo').show()
  } else {
    $('.svg_shirt_tirantes').show()
  }
>>>>>>> master
  $('.svg_shirt_chaleco').css({'fill': chara.svg_shirt_chaleco})
  $('.svg_shirt_tirantes').css({'fill': chara.svg_shirt_tirantes})
  $('.svg_shirt_rayas').css({'fill': chara.svg_shirt_rayas})
  $('.svg_shirt_flash').css({'fill': chara.svg_shirt_flash})
  $('.svg_pants').css({'fill': chara.svg_pants}).hide()
  if (chara.pantType === 'falda') {
    $('.svg_pants_falda').show()
  } else if (chara.pantType === 'corto') {
    $('.svg_pants_corto').show()
  } else {
    $('.svg_pants_largo').show()
  }
  $('.svg_shirt').css({'fill': chara.svg_shirt}).hide()
  if (chara.shirtType === 'tirantes') {
    $('.svg_shirt_tirantes').show()
  } else if (chara.shirtType === 'corto') {
    $('.svg_shirt_corto').show()
  } else {
    $('.svg_shirt_largo').show()
  }
  $('.svg_shoes').css({'fill': chara.svg_shoes})
<<<<<<< HEAD

  var et = []
  et['.svg_hair'] = 'corto'
  et['.svg_shirt'] = 'corto'
  et['.svg_pants'] = 'largo'
=======
  if ((chara.pantType === 'falda') && (chara.hairType === 'largo')) {
    $('.Chara .svg_base, .Chara .svg_sombra').css({'fill': 'transparent', 'stroke': 'transparent'})
    $('.Chara .svg_base.svg_base_pelo_falda').css({'fill': '#000', 'stroke': '#000'})
    $('.Chara .svg_sombra.svg_base_pelo_falda').css({'fill': 'rgba(0,0,0,.5)'})
  } else if ((chara.pantType === 'falda') && (chara.hairType !== 'largo')) {
    $('.Chara .svg_base, .Chara .svg_sombra').css({'fill': 'transparent', 'stroke': 'transparent'})
    $('.Chara .svg_base.svg_base_falda').css({'fill': '#000', 'stroke': '#000'})
    $('.Chara .svg_sombra.svg_base_falda').css({'fill': 'rgba(0,0,0,.5)'})
  } else if ((chara.pantType !== 'falda') && (chara.hairType === 'largo')) {
    $('.Chara .svg_base, .Chara .svg_sombra').css({'fill': 'transparent', 'stroke': 'transparent'})
    $('.Chara .svg_base.svg_base_pelo').css({'fill': '#000', 'stroke': '#000'})
    $('.Chara .svg_sombra.svg_base_pelo').css({'fill': 'rgba(0,0,0,.5)'})
  } else {
    $('.Chara .svg_base, .Chara .svg_sombra').css({'fill': 'transparent', 'stroke': 'transparent'})
    $('.Chara .svg_base.svg_base_hombre').css({'fill': '#000', 'stroke': '#000'})
    $('.Chara .svg_sombra.svg_base_hombre').css({'fill': 'rgba(0,0,0,.5)'})
  }
>>>>>>> master

  $('.elije-color').on('click', function () {
    var parte = $(this).attr('data-parte')
    console.log(parte)
    CharaColores(parte, chara)
    $('.Chara-opciones .opciones').empty()
    if ($(this).attr('data-tipos')) {
      var tipos = $(this).attr('data-tipos')
      var tipo = tipos.split(' ')
      for (var i = 0; i < tipo.length; i++) {
        $('.Chara .opciones').append('<a data-tipo="' + tipo[i] + '" class="button opcion">' + tipo[i] + '</a> ')
      }

      $('.opcion').on('click', function () {
        if (parte === 'svg_hair') chara['hairType'] = $(this).attr('data-tipo')
<<<<<<< HEAD
        else if (parte === 'svg_shirt') chara['shirtType'] = $(this).attr('data-tipo')
        else chara['pantType'] = $(this).attr('data-tipo')

        if ($(this).attr('data-tipo') === 'falda') $('.elije-color[data-parte="svg_pants"]').text('Falda')
        if (parte === 'svg_pants' && ($(this).attr('data-tipo') === 'corto' || $(this).attr('data-tipo') === 'largo')) $('.elije-color[data-parte="svg_pants"]').text('Pantalón')
=======
        else if (parte === 'svg_pants') chara['pantType'] = $(this).attr('data-tipo')
        else chara['shirtType'] = $(this).attr('data-tipo')

        if ($(this).attr('data-tipo') === 'falda') $('.elije-color[data-parte="svg_pants"]').text('Falda')
        if ($(this).attr('data-tipo') === 'corto' || $(this).attr('data-tipo') === 'largo') $('.elije-color[data-parte="svg_pants"]').text('Pantalón')
>>>>>>> master
        $('.' + parte).hide()
        var parteTipo = '.' + parte + '_' + $(this).attr('data-tipo')

        $(parteTipo).show()
        if ((chara.pantType === 'falda') && (chara.hairType === 'largo')) {
          $('.Chara .svg_base, .Chara .svg_sombra').css({'fill': 'transparent', 'stroke': 'transparent'})
          $('.Chara .svg_base.svg_base_pelo_falda').css({'fill': '#000', 'stroke': '#000'})
          $('.Chara .svg_sombra.svg_base_pelo_falda').css({'fill': 'rgba(0,0,0,.5)'})
        } else if ((chara.pantType === 'falda') && (chara.hairType !== 'largo')) {
          $('.Chara .svg_base, .Chara .svg_sombra').css({'fill': 'transparent', 'stroke': 'transparent'})
          $('.Chara .svg_base.svg_base_falda').css({'fill': '#000', 'stroke': '#000'})
          $('.Chara .svg_sombra.svg_base_falda').css({'fill': 'rgba(0,0,0,.5)'})
        } else if ((chara.pantType !== 'falda') && (chara.hairType === 'largo')) {
          $('.Chara .svg_base, .Chara .svg_sombra').css({'fill': 'transparent', 'stroke': 'transparent'})
          $('.Chara .svg_base.svg_base_pelo').css({'fill': '#000', 'stroke': '#000'})
          $('.Chara .svg_sombra.svg_base_pelo').css({'fill': 'rgba(0,0,0,.5)'})
        } else {
          $('.Chara .svg_base, .Chara .svg_sombra').css({'fill': 'transparent', 'stroke': 'transparent'})
          $('.Chara .svg_base.svg_base_hombre').css({'fill': '#000', 'stroke': '#000'})
          $('.Chara .svg_sombra.svg_base_hombre').css({'fill': 'rgba(0,0,0,.5)'})
        }
      })
    }

    $('.Chara .partes').hide()
    $('.Chara-opciones').slideDown()
  })
}
function CharaColores (parte, chara) {
  console.log(chara)
  var colores = ['transparent', '#efbe92', '#edb69f', '#c0642e', '#8b391e', '#402420', '#000000', '#ffffff', '#ffefbd', '#ffc500', '#e45214', '#c22b2a', '#ff8ea4', '#693d9f', '#004584', '#007ebe', '#0f8a49', '#5ccf97', '#182c1d', '#ca1146', '#5a0b15', '#67a9bf', '#8e9397']
  $('.Chara-opciones .colores').empty()
  for (var i = 0; i < colores.length; i++) {
    if (colores[i] === 'transparent') {
      $('.Chara .colores').append('<a data-color="' + colores[i] + '" style="background-color:' + colores[i] + '" class="button color">Borrar</a> <br>')
    } else {
      $('.Chara .colores').append('<a data-color="' + colores[i] + '" style="background-color:' + colores[i] + '" class="button color"></a> ')
    }
    if (i % 6 === 0) $('.Chara .colores').append('<br>')
  }
  $('.Chara .colores').append('<br><a class="button color">Cerrar</a> <br>')

  $('.color').on('click', function () {
    if ($(this).attr('data-color')) $('.' + parte).css({'fill': $(this).attr('data-color')})
    $('.Chara-opciones').hide()
    $('.Chara .partes').fadeIn()
    chara[parte] = $(this).attr('data-color')

    if (localStorage.datos) {
      var datos = JSON.parse(localStorage.datos)
      datos['chara'] = chara
      localStorage.setItem('datos', JSON.stringify(datos))
      new Firebase('https://boda201610.firebaseio.com/')
        .child(datos.id)
        .set(datos)
    }
  })
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

  if ($(location).attr('hostname') === 'localhost') {
    page.base('/boda')
  } else {
    page.base('')
  }
  page('/', PaginaHome)
  page('/home', PaginaHome)
  page('/dibuja', PaginaChara)
  page('/informacion', PaginaMapa)
  page('/invitado', Login)
  page('/invitado/:pass', Login)
  page('/salir', Logout)
  page('/musica', PaginaMusica)
  page('/buscarmusica', PaginaMusicaBuscar)
  page('/*', Pagina404)
  page({
    hashbang: true
  })
})

