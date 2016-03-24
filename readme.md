# Readme

Conjunto de herramientas para el desarrollo con sass y minimizar ficheros.

Se necesita tener instalado node en la máquina de desarrollo.

Se copian los ficheros *Gulpfile.js* y *package.json* en la raiz del proyecto y ejecutar el comando:

	npm install

Una vez instaladas las dependencias necesarias editar el archivo *Gulpfile.js* para indicar las rutas de los css y js necesarios. La estructura recomendada sería:

	- src
		- sass	// Sass iniciales
		- css	// CSS intermedios
		- js	// JS iniciales
	- app
		-css	// CSS final, unido y minimizado (ademas del sourcemap)
		-js		// JS final, unido y minimizado (ademas del sourcemap)

Durante el desarrollo ejecutar en la consola:

	gulp

Mientras el comando esté ejecutandose observará los cambios que hagamos en los archivos iniciales e intermedios y automatizará el procesado y minimizado.

	- /?inicio

	- /?listado

	- /?fitxa&nid=valor nid del json

	- /?concesion&vCodhost=valor vCodhost del json

	- imagenes laterales: http://red.nissan.es/dp13/filesUploaded/0000/ + imagen


	- imagenes de vehiculos: http://red.nissan.es/dp13/filesUploaded/ + codhost + / + imagen

	- en cualquier listado los que tengan bpenalizacion saldran ultimos haya el filtro que haya!!! (confirmar con carmen)

	- buscador: /?buscador=[valor]